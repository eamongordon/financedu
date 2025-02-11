import { activities, activityToQuestions } from "./db/schema";

export type Activity = typeof activities.$inferSelect & {
    activityToQuestions?: (typeof activityToQuestions.$inferSelect & {
        question: Question;
    })[];
}

export type QuestionType = "matching" | "numeric" | "multiselect" | "radio" | "info" | "text";
export type QuestionDifficulty = "easy" | "medium" | "hard";

export interface BaseQuestion {
    id: string;
    type: QuestionType;
    difficulty?: QuestionDifficulty;
    instructions?: string;
    topics?: string[];
}

export interface MatchingQuestion extends BaseQuestion {
    type: "matching";
    subquestions: MatchingSubquestion[];
}

export interface NumericQuestion extends BaseQuestion {
    type: "numeric";
    numericAnswer?: number;
    tolerance?: number;
}

export interface MultiselectQuestion extends BaseQuestion {
    type: "multiselect";
    options: QuestionOption[];
}

export interface RadioQuestion extends BaseQuestion {
    type: "radio";
    options: QuestionOption[];
}

export interface InfoQuestion extends BaseQuestion {
    type: "info";
}

export interface TextQuestion extends BaseQuestion {
    type: "text";
    placeholder?: string;
}

export type Question = MatchingQuestion | NumericQuestion | MultiselectQuestion | RadioQuestion | InfoQuestion | TextQuestion;

export interface QuestionOption {
    id: string;
    questionId: string;
    value: string;
    isCorrect: boolean;
}

export interface MatchingSubquestion {
    id: string;
    questionId: string;
    instructions: string;
    correctMatchingOptionId: string;
    options?: MatchingOption[];
}

export interface MatchingOption {
    id: string;
    questionId: string;
    value: string;
}

export interface QuizActivity extends Activity {
    type: "Quiz";
    activityToQuestions: (typeof activityToQuestions.$inferSelect & {
        question: Question;
    })[];
}

export function isQuizActivity(activity: Activity): activity is QuizActivity {
    return activity.type === "Quiz" && !!activity.activityToQuestions
}

export function isMatchingQuestion(question: Question): question is MatchingQuestion {
    return question.type === "matching";
}

export function isNumericQuestion(question: Question): question is NumericQuestion {
    return question.type === "numeric";
}

export function isMultiselectQuestion(question: Question): question is MultiselectQuestion {
    return question.type === "multiselect";
}

export function isRadioQuestion(question: Question): question is RadioQuestion {
    return question.type === "radio";
}

export function isInfoQuestion(question: Question): question is InfoQuestion {
    return question.type === "info";
}

export function isTextQuestion(question: Question): question is TextQuestion {
    return question.type === "text";
}