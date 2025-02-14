"use client";

import { useState, useEffect } from "react";
import { RadioQuestion } from "@/components/questions/radio-question";
import { MultiselectQuestion } from "@/components/questions/multiselect-question";
import { NumericQuestion } from "@/components/questions/numeric-question";
import { TextQuestion } from "@/components/questions/text-question";
import { MatchingQuestion } from "@/components/questions/matching-question";
import { InfoQuestion } from "@/components/questions/info-question";
import { type Activity } from "@/types";
import { Button } from "../ui/button";

type Response = string | string[] | number;

export default function QuizComponent({ activity }: { activity: Activity }) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [response, setResponse] = useState<Response>([]);
    const [validity, setValidity] = useState(false);
    const [showAnswer, setShowAnswer] = useState(false);
    const [questionResponses, setQuestionResponses] = useState<boolean[]>([]); // New state to track correctness

    const currentQuestion = activity.activityToQuestions[currentQuestionIndex].question;

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

    const handleNextQuestion = () => {
        if (showAnswer) {
            if (currentQuestionIndex < activity.activityToQuestions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
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
                return response === currentQuestion.questionOptions[0].id;
            case "text":
                return true;
            case "matching":
                return (response as string[]).every((selectedOption) =>
                    currentQuestion.questionOptions.find((option) => option.id === selectedOption)?.isCorrect
                );
            case "info":
                return true;
            default:
                return false;
        }
    };

    const getDotClass = (index: number) => {
        if (index < questionResponses.length) {
            return questionResponses[index] ? "bg-primary border-primary" : "bg-muted";
        }
        return "";
    };

    return (
        <div className="flex flex-col items-center sm:min-h-[calc(100vh-181px)] relative">
            <div className="py-8 w-full flex justify-center h-[calc(100vh-254px)] overflow-scroll">
                {currentQuestion.type === "radio" && (
                    <RadioQuestion
                        question={currentQuestion}
                        onResponseChange={handleResponseChange}
                        onValidChange={handleValidChange}
                        showAnswer={showAnswer} // Pass showAnswer prop
                    />
                )}
                {currentQuestion.type === "multiselect" && (
                    <MultiselectQuestion
                        question={currentQuestion}
                        onResponseChange={handleResponseChange}
                        onValidChange={handleValidChange}
                        showAnswer={showAnswer} // Pass showAnswer prop
                    />
                )}
                {currentQuestion.type === "numeric" && (
                    <NumericQuestion
                        question={currentQuestion}
                        onResponseChange={handleResponseChange}
                        onValidChange={handleValidChange}
                        showAnswer={showAnswer} // Pass showAnswer prop
                    />
                )}
                {currentQuestion.type === "text" && (
                    <TextQuestion question={currentQuestion} />
                )}
                {currentQuestion.type === "matching" && (
                    <MatchingQuestion question={currentQuestion} />
                )}
                {currentQuestion.type === "info" && (
                    <InfoQuestion question={currentQuestion} />
                )}
            </div>
            <div className="border-t w-full p-4 flex justify-end items-center absolute bottom-0">
                <div className="w-full text-center flex flex-row gap-4 justify-center items-center space-x-2">
                    <p className="font-semibold text-muted-foreground">{questionResponses.length ? `${questionResponses.length} / ${activity.activityToQuestions.length} Done` : `${activity.activityToQuestions.length} Question${activity.activityToQuestions.length === 1 ? "" : "s"}`}</p>
                    <div className="flex flex-row gap-2">
                        {activity.activityToQuestions.map((_, index) => (
                            <div key={index} className={`size-3 rounded-full border-2 ${getDotClass(index)}`}></div>
                        ))}
                    </div>
                </div>
                <Button onClick={handleNextQuestion} className="mr-2" disabled={!validity}>{showAnswer ? "Next Question" : "Check Answer"}</Button>
            </div>
        </div>
    );
}