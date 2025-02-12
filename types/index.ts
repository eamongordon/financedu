import { getActivity } from "@/lib/actions";

export type Activity = Awaited<ReturnType<typeof getActivity>>;
export type Question = Activity["activityToQuestions"][0]["question"];