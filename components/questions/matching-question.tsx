import { Select, SelectItem } from "@/components/ui/select";
import { Question } from "@/types";

export function MatchingQuestion({ question }: { question: Question }) {
    return (
        <div>
            {question.matchingSubquestions?.map((subquestion) => (
                <div key={subquestion.id}>
                    <p>{subquestion.instructions}</p>
                    <Select>
                        {question.matchingOptions?.map((option) => (
                            <SelectItem key={option.id} value={option.value}>{option.value}</SelectItem>
                        ))}
                    </Select>
                </div>
            ))}
        </div>
    );
}
