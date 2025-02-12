import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Question } from "@/types";

export function MatchingQuestion({ question }: { question: Question }) {
    return (
        <div>
            {question.matchingSubquestions?.map((subquestion) => (
                <div key={subquestion.id}>
                    <p>{subquestion.instructions}</p>
                    <Select>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select a fruit" />
                        </SelectTrigger>
                        <SelectContent>
                            {question.matchingOptions?.map((option) => (
                                <SelectItem key={option.id} value={option.value}>{option.value}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            ))}
        </div>
    );
}
