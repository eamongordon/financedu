"use client";

import { useState } from "react";
import { RadioQuestion } from "@/components/questions/radio-question";
import { MultiselectQuestion } from "@/components/questions/multiselect-question";
import { NumericQuestion } from "@/components/questions/numeric-question";
import { TextQuestion } from "@/components/questions/text-question";
import { MatchingQuestion } from "@/components/questions/matching-question";
import { InfoQuestion } from "@/components/questions/info-question";
import { type Activity } from "@/types";

export default function QuizComponent({ activity }: { activity: Activity }) {
    const [currentQuestionIndex] = useState(0);

    console.log("QuizActivity", activity);

    const currentQuestion = activity.activityToQuestions[currentQuestionIndex].question;

    /*
    const checkAnswer = (selectedAnswer?: any) => {
        // Logic to check if the selected answer is correct
        const correct = selectedAnswer === currentQuestion.correctAnswer;
        setIsCorrect(correct);
        setShowNextButton(true);
    };
    */
    /*
        const nextQuestion = () => {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setShowNextButton(false);
            setIsCorrect(null);
        };
    */
    return (
        <div>
            <h2>Test Text</h2>
            <div className="bg-gray-500"></div>
            <h2>{currentQuestion.id}</h2>
            {/* Render question based on type */}
            {currentQuestion.type === "radio" && <RadioQuestion question={currentQuestion} />}
            {currentQuestion.type === "multiselect" && <MultiselectQuestion question={currentQuestion} />}
            {currentQuestion.type === "numeric" && <NumericQuestion question={currentQuestion} />}
            {currentQuestion.type === "text" && <TextQuestion question={currentQuestion} />}
            {currentQuestion.type === "matching" && <MatchingQuestion question={currentQuestion} />}
            {currentQuestion.type === "info" && <InfoQuestion question={currentQuestion} />}
        </div>
    );
}