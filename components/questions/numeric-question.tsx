import { Input } from "@/components/ui/input";
import { Question } from "@/types";

export function NumericQuestion({ question }: { question: Question }) {
    return (
        <div>
            <Input type="number" />
        </div>
    );
}
