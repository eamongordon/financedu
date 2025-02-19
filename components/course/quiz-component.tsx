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
import { useSession } from "next-auth/react";
import { markActivityComplete } from "@/lib/actions";

type Response = string | string[] | number | { id: string, response: string }[];

export default function QuizComponent({ activity, nextActivity }: { activity: Activity, nextActivity: NextActivity }) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [response, setResponse] = useState<Response>([]);
    const [validity, setValidity] = useState(false);
    const [showAnswer, setShowAnswer] = useState(false);
    const [questionResponses, setQuestionResponses] = useState<boolean[]>([]); // New state to track correctness
    const [isQuizFinished, setIsQuizFinished] = useState(false); // New state to track if the quiz is finished

    const currentQuestion = activity.activityToQuestions[currentQuestionIndex].question;

    const params = useParams<{ lessonId: string; moduleId: string, courseId: string }>();
    const currentLessonId = params!.lessonId;
    const currentModuleId = params!.moduleId;
    const currentCourseId = params!.courseId;

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
                setValidity(true);
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
        console.log("Response:", response);
    };

    const handleValidChange = (isValid: boolean) => {
        console.log("isValid:", isValid);
        setValidity(isValid);
    };

    const handleSubmit = () => {
        if (validity) {
            console.log("Submitted answers:", response);
            const isCorrect = checkAnswer(response); // Function to check if the response is correct
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
            await markActivityComplete(activity.id, currentLessonId, currentModuleId, currentCourseId);
            await router.refresh();
        }
    };

    const getDotClass = (index: number) => {
        if (index < questionResponses.length) {
            return questionResponses[index] ? "bg-primary border-primary" : "bg-muted";
        }
        return "";
    };

    const { href, label } = getNextActivityLink(currentCourseId, currentModuleId, currentLessonId, nextActivity);

    return (
        <div className="flex flex-col items-center h-[calc(100dvh-202px)] sm:min-h-[calc(100vh-196px)] relative">
            <div className="py-8 w-full flex justify-center h-[calc(100vh-274px)] sm:h-[calc(100vh-268px)] overflow-scroll">
                {isQuizFinished ? (
                    <p>You finished the quiz</p>
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
                    <TextQuestion question={currentQuestion} />
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
            <div className="border-t w-full p-4 flex justify-end items-center absolute bottom-0 bg-background">
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