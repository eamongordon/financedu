import { Question } from "@/types";

export function InfoQuestion({ question }: { question: Question }) {
    return (
        <div>
            <p dangerouslySetInnerHTML={{ __html: question.instructions ?? "" }}></p>
        </div>
    );
}
