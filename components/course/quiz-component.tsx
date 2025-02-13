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
    const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
    
    const currentQuestion = activity.activityToQuestions[currentQuestionIndex].question;

    useEffect(() => {
        switch (currentQuestion.type) {
            case "radio":
                setResponse("");
                break;
            case "multiselect":
                setResponse([]);
                break;
            case "numeric":
                setResponse(0);
                break;
            case "text":
                setResponse("");
                break;
            case "matching":
                setResponse([]);
                break;
            case "info":
                setResponse("");
                break;
            default:
                setResponse("");
        }
        setShowCorrectAnswer(false); // Reset showCorrectAnswer when currentQuestion changes
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
        } else {
            console.log("Some questions are invalid.");
        }
    };

    const handleNextQuestion = () => {
        if (showCorrectAnswer) {
            if (currentQuestionIndex < activity.activityToQuestions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
            }
        } else {
            setShowCorrectAnswer(true);
        }
    };

    return (
        <div className="flex flex-col items-center sm:min-h-[calc(100vh-181px)] relative">
            <div className="py-8 w-full flex justify-center">
                {currentQuestion.type === "radio" && (
                    <RadioQuestion
                        question={currentQuestion}
                        onResponseChange={handleResponseChange}
                        onValidChange={handleValidChange}
                        showCorrectAnswer={showCorrectAnswer} // Pass showCorrectAnswer prop
                    />
                )}
                {currentQuestion.type === "multiselect" && (
                    <MultiselectQuestion
                        question={currentQuestion}
                        onResponseChange={handleResponseChange}
                        onValidChange={handleValidChange}
                        showCorrectAnswer={showCorrectAnswer} // Pass showCorrectAnswer prop
                    />
                )}
                {currentQuestion.type === "numeric" && (
                    <NumericQuestion
                        question={currentQuestion}
                        onResponseChange={handleResponseChange}
                        onValidChange={handleValidChange}
                        showCorrectAnswer={showCorrectAnswer} // Pass showCorrectAnswer prop
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
            <div className="border-t w-full p-4 flex justify-end absolute bottom-0">
                <Button onClick={handleNextQuestion} className="mr-2">Next</Button>
                <Button onClick={handleSubmit} disabled={!validity}>Submit</Button>
            </div>
        </div>
    );
}