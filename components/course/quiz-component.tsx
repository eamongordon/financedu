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
        if (currentQuestionIndex < activity.activityToQuestions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    return (
        <div>
            <h2>Test Text</h2>
            <div className="bg-gray-500"></div>
            <h2>{currentQuestion.id}</h2>
            {/* Render question based on type */}
            {currentQuestion.type === "radio" && (
                <RadioQuestion
                    question={currentQuestion}
                    onResponseChange={handleResponseChange}
                    onValidChange={handleValidChange}
                />
            )}
            {currentQuestion.type === "multiselect" && (
                <MultiselectQuestion
                    question={currentQuestion}
                    onResponseChange={handleResponseChange}
                    onValidChange={handleValidChange}
                />
            )}
            {currentQuestion.type === "numeric" && (
                <NumericQuestion question={currentQuestion} />
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
            <Button onClick={handleSubmit} disabled={!validity}>Submit</Button>
            <Button onClick={handleNextQuestion}>Next Question</Button>
        </div>
    );
}