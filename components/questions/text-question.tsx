import { Question } from "@/types";

export function TextQuestion({ question }: { question: Question }) {
    return (
        <div>
            <input type="text" placeholder={question.placeholder ?? undefined} />
        </div>
    );
}
