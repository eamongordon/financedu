import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Question } from "@/types";

export function MultiselectQuestion({ question }: { question: Question }) {
    return (
        <div className="space-y-2">
            {question.questionOptions?.map((option) => (
                <div className="flex items-center space-x-2" key={option.id}>
                    <Checkbox value={option.value} />
                    <Label>{option.value}</Label>
                </div>
            ))}
        </div>
    );
}
