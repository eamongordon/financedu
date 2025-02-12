import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Question } from "@/types";

export function RadioQuestion({ question }: { question: Question }) {
    return (
        <RadioGroup>
            {question.questionOptions?.map((option) => (
                <div className="flex items-center space-x-2" key={option.id}>
                    <RadioGroupItem value={option.value} />
                    <Label>{option.value}</Label>
                </div>
            ))}
        </RadioGroup>
    );
}
