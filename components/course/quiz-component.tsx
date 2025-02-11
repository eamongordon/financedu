"use client";

import { useState } from "react";
import { getActivity } from "@/lib/actions";

type ActivityResult = Awaited<ReturnType<typeof getActivity>>;

export default function QuizComponent({ activity }: { activity: ActivityResult }) {
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
            {currentQuestion.type === "radio" && (
                <div>
                    {currentQuestion.questionOptions.map((option: any) => (
                        <button key={option.id} onClick={() => console.log(option.value)}>
                            {option.value}
                        </button>
                    ))}
                </div>
            )}
            {currentQuestion.type === "multiselect" && (
                <div>
                    {currentQuestion.questionOptions.map((option: any) => (
                        <label key={option.id}>
                            <input type="checkbox" value={option.value} />
                            {option.value}
                        </label>
                    ))}
                    
                </div>
            )}
            {currentQuestion.type === "numeric" && (
                <div>
                    <input type="number" />
                   
                </div>
            )}
            {currentQuestion.type === "text" && (
                <div>
                    <input type="text" placeholder={currentQuestion.placeholder ?? undefined} />
                   
                </div>
            )}
            {currentQuestion.type === "matching" && (
                <div>
                    {currentQuestion.matchingSubquestions.map((subquestion) => (
                        <div key={subquestion.id}>
                            <p>{subquestion.instructions}</p>
                            <select>
                                {currentQuestion.matchingOptions.map((option) => (
                                    <option key={option.id} value={option.value}>{option.value}</option>
                                ))}
                            </select>
                        </div>
                    ))}
                    
                </div>
            )}
            {currentQuestion.type === "info" && (
                <div>
                    <p>{currentQuestion.instructions}</p>
                </div>
            )}
        </div>
    );
}