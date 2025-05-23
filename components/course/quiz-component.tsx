"use client";

import { useState, useEffect } from "react";
import { RadioQuestion } from "@/components/questions/radio-question";
import { MultiselectQuestion } from "@/components/questions/multiselect-question";
import { NumericQuestion } from "@/components/questions/numeric-question";
import { TextQuestion } from "@/components/questions/text-question";
import { MatchingQuestion } from "@/components/questions/matching-question";
import { InfoQuestion } from "@/components/questions/info-question";
import { type NextActivity, type Activity } from "@/types";
import { Button, buttonVariants } from "../ui/button";
import Link from "next/link";
import { useParams, useRouter } from 'next/navigation'
import { getNextActivityLink } from "@/lib/utils";
import { useSession } from "@/lib/auth-client";
import { markActivityComplete } from "@/lib/actions";
import { Progress } from "../ui/progress";
import { RotateCw } from "lucide-react";

type Response = string | string[] | number | { id: string, response: string }[];

export default function QuizComponent({ activity, nextActivity }: { activity: Activity, nextActivity: NextActivity }) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [response, setResponse] = useState<Response>([]);
    const [validity, setValidity] = useState(false);
    const [showAnswer, setShowAnswer] = useState(false);
    const [questionResponses, setQuestionResponses] = useState<boolean[]>([]); // Track correctness
    const [isQuizFinished, setIsQuizFinished] = useState(false); // Track if the quiz is finished

    const currentQuestion = activity.activityToQuestions[currentQuestionIndex].question;

    const params = useParams<{ lessonSlug: string; moduleSlug: string, courseSlug: string }>();
    const currentLessonSlug = params!.lessonSlug;
    const currentModuleSlug = params!.moduleSlug;
    const currentCourseSlug = params!.courseSlug;

    const router = useRouter();
    const { data: session } = useSession();

    useEffect(() => {
        switch (currentQuestion.type) {
            case "radio":
                setResponse("");
                setValidity(false);
                break;
            case "multiselect":
                setResponse([]);
                setValidity(false);
                break;
            case "numeric":
                setResponse(0);
                setValidity(false);
                break;
            case "text":
                setResponse("");
                setValidity(false);
                break;
            case "matching":
                setResponse([]);
                setValidity(false);
                break;
            case "info":
                setResponse("");
                setValidity(true);
                break;
            default:
                setResponse("");
        }
        setShowAnswer(false); // Reset showAnswer when currentQuestion changes
    }, [currentQuestion]);

    const handleResponseChange = (response: Response) => {
        setResponse(response);
    };

    const handleValidChange = (isValid: boolean) => {
        setValidity(isValid);
    };

    const handleSubmit = () => {
        if (validity) {
            console.log("Submitted answers:", response);
            const isCorrect = checkAnswer(response); // Check if the response is correct
            const updatedResponses = [...questionResponses];
            updatedResponses[currentQuestionIndex] = isCorrect;
            setQuestionResponses(updatedResponses); // Update questionResponses state
        } else {
            console.log("Some questions are invalid.");
        }
    };

    const handleNextQuestion = async () => {
        if (showAnswer) {
            if (currentQuestionIndex < activity.activityToQuestions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
            } else {
                setIsQuizFinished(true); // Set quiz as finished
                await handleQuizComplete(); // Call handleQuizComplete when quiz is finished
            }
        } else {
            setShowAnswer(true);
            handleSubmit();
        }
    };

    const checkAnswer = (response: Response): boolean => {
        switch (currentQuestion.type) {
            case "radio":
                return response === currentQuestion.questionOptions.find((option) => option.isCorrect)?.id;
            case "multiselect":
                const selectedOptions = response as string[];
                const correctOptions = currentQuestion.questionOptions.filter((option) => option.isCorrect).map((option) => option.id);
                return selectedOptions.every((selectedOption) => correctOptions.includes(selectedOption)) &&
                    correctOptions.every((correctOption) => selectedOptions.includes(correctOption));
            case "numeric":
                return Number(response) === Number(currentQuestion.numericAnswer)
            case "text":
                return true;
            case "matching":
                const matchingResponses = response as { id: string, response: string }[];
                return matchingResponses.every(({ id, response }) => {
                    const subquestion = currentQuestion.matchingSubquestions.find(sub => sub.id === id);
                    return subquestion && subquestion.correctMatchingOptionId === response;
                });
            case "info":
                return true;
            default:
                return false;
        }
    };

    const handleQuizComplete = async () => {
        if (session && session.user && session.user.id) {
            const correctAnswers = questionResponses.filter(isCorrect => isCorrect).length;
            const totalQuestions = questionResponses.length;
            await markActivityComplete(activity.id, correctAnswers, totalQuestions);
            await router.refresh();
        }
    };

    const getCorrectAnswersCount = () => {
        return questionResponses.filter(isCorrect => isCorrect).length;
    };

    const getAccuracyMessage = (correctAnswers: number, totalQuestions: number) => {
        if (correctAnswers === totalQuestions) {
            return "Perfect score! Well done!";
        } else if (correctAnswers >= totalQuestions * 0.75) {
            return "Awesome! You did very well.";
        } else {
            return "Don't worry, you're getting there!";
        }
    };

    const getDotClass = (index: number) => {
        if (index < questionResponses.length) {
            return questionResponses[index] ? "bg-primary border-primary" : "bg-muted";
        }
        return "";
    };

    const handleRetry = () => {
        setCurrentQuestionIndex(0);
        setResponse([]);
        setValidity(false);
        setShowAnswer(false);
        setQuestionResponses([]);
        setIsQuizFinished(false);
    };

    const { href, label } = getNextActivityLink(currentCourseSlug, currentModuleSlug, currentLessonSlug, nextActivity);

    return (
        <div className="flex-1 flex flex-col items-center overflow-auto">
            <div className="flex-1 py-8 w-full flex justify-center overflow-auto">
                {isQuizFinished ? (
                    <div className="h-full justify-center items-center flex flex-col gap-4">
                        <div className="flex flex-col gap-2 items-center">
                            <h1 className="text-2xl font-semibold text-center">Quiz Finished</h1>
                            <p className="text-center text-muted-foreground">{getAccuracyMessage(getCorrectAnswersCount(), activity.activityToQuestions.length)}</p>
                        </div>
                        <div className="flex flex-col gap-2 items-center">
                            <p className="text-center text-muted-foreground font-semibold">{`${getCorrectAnswersCount()} / ${activity.activityToQuestions.length} Correct`}</p>
                            <Progress value={(getCorrectAnswersCount() / questionResponses.length) * 100} className="bg-destructive/40" />
                        </div>
                        <Button
                            onClick={handleRetry} className="mt-4"
                            variant="outline"
                        >
                            <RotateCw />
                            Retry Quiz
                        </Button>
                    </div>
                ) : currentQuestion.type === "radio" ? (
                    <RadioQuestion
                        question={currentQuestion}
                        onResponseChange={handleResponseChange}
                        onValidChange={handleValidChange}
                        showAnswer={showAnswer}
                    />
                ) : currentQuestion.type === "multiselect" ? (
                    <MultiselectQuestion
                        question={currentQuestion}
                        onResponseChange={handleResponseChange}
                        onValidChange={handleValidChange}
                        showAnswer={showAnswer}
                    />
                ) : currentQuestion.type === "numeric" ? (
                    <NumericQuestion
                        question={currentQuestion}
                        onResponseChange={handleResponseChange}
                        onValidChange={handleValidChange}
                        showAnswer={showAnswer}
                    />
                ) : currentQuestion.type === "text" ? (
                    <TextQuestion
                        question={currentQuestion}
                        onResponseChange={handleResponseChange}
                        onValidChange={handleValidChange}
                        showAnswer={showAnswer}
                    />
                ) : currentQuestion.type === "matching" ? (
                    <MatchingQuestion
                        question={currentQuestion}
                        onResponseChange={handleResponseChange}
                        onValidChange={handleValidChange}
                        showAnswer={showAnswer}
                    />
                ) : currentQuestion.type === "info" ? (
                    <InfoQuestion question={currentQuestion} />
                ) : null}
            </div>
            <div className="border-t w-full p-4 flex justify-end items-center bg-background">
                <div className="w-full text-center flex flex-row gap-4 justify-center items-center space-x-2">
                    <p className="font-semibold text-muted-foreground">{questionResponses.length ? `${questionResponses.length} / ${activity.activityToQuestions.length} Done` : `${activity.activityToQuestions.length} Question${activity.activityToQuestions.length === 1 ? "" : "s"}`}</p>
                    <div className="flex flex-row gap-2">
                        {activity.activityToQuestions.map((_, index) => (
                            <div key={index} className={`size-3 rounded-full border-2 ${getDotClass(index)}`}></div>
                        ))}
                    </div>
                </div>
                <Button onClick={handleNextQuestion} variant="outline" className="mr-2" disabled={isQuizFinished}>Skip</Button>
                {isQuizFinished && nextActivity ? (
                    <Link href={href} className={buttonVariants()}>
                        {label}
                    </Link>
                ) : (
                    <Button onClick={handleNextQuestion} className="mr-2" disabled={!validity && !isQuizFinished}>
                        {isQuizFinished ?
                            "Finish Quiz"
                            :
                            showAnswer ?
                                currentQuestionIndex + 1 === activity.activityToQuestions.length ? "Finish Quiz" :
                                    "Next Question" :
                                "Check Answer"
                        }
                    </Button>
                )}
            </div>
        </div>
    );
}