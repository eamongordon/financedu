"use client";

import { useState } from "react";
import { RadioQuestion } from "@/components/questions/radio-question";
import { MultiselectQuestion } from "@/components/questions/multiselect-question";
import { NumericQuestion } from "@/components/questions/numeric-question";
import { TextQuestion } from "@/components/questions/text-question";
import { MatchingQuestion } from "@/components/questions/matching-question";
import { InfoQuestion } from "@/components/questions/info-question";
import { type Activity } from "@/types";

type Response = string | string[];

export default function QuizComponent({ activity }: { activity: Activity }) {
    const [currentQuestionIndex] = useState(0);
    const [response, setResponse] = useState<Response>([]);
    const [validity, setValidity] = useState(false);

    const currentQuestion = activity.activityToQuestions[currentQuestionIndex].question;

    const handleResponseChange = (response: Response, isValid: boolean) => {
        setResponse(response);
        setValidity(isValid);
    };

    const handleSubmit = () => {
        if (Object.values(validity).every((isValid) => isValid)) {
            console.log("Submitted answers:", response);
        } else {
            console.log("Some questions are invalid.");
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
                />
            )}
            {currentQuestion.type === "multiselect" && (
                <MultiselectQuestion question={currentQuestion} onResponseChange={handleResponseChange} />
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
            <button onClick={handleSubmit}>Submit</button>
        </div>
    );
}