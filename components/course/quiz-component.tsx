"use client";

import { useState } from "react";
import { getActivity } from "@/lib/actions";
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectItem } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

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
                <RadioGroup>
                    {currentQuestion.questionOptions.map((option) => (
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem key={option.id} value={option.value} />
                            <Label>{option.value}</Label>
                        </div>
                    ))}
                </RadioGroup>
            )}
            {currentQuestion.type === "multiselect" && (
                <div className="space-y-2">
                    {currentQuestion.questionOptions.map((option) => (
                        <div className="flex items-center space-x-2" key={option.id}>
                            <Checkbox value={option.value} />
                            <Label>{option.value}</Label>
                        </div>
                    ))}
                </div>
            )}
            {currentQuestion.type === "numeric" && (
                <div>
                    <Input type="number" />
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
                            <Select>
                                {currentQuestion.matchingOptions.map((option) => (
                                    <SelectItem key={option.id} value={option.value}>{option.value}</SelectItem>
                                ))}
                            </Select>
                        </div>
                    ))}

                </div>
            )}
            {currentQuestion.type === "info" && (
                <div>
                    <p dangerouslySetInnerHTML={{ __html: currentQuestion.instructions ?? "" }}></p>
                </div>
            )}
        </div>
    );
}