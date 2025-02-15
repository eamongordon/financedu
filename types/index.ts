import { getActivity, getNextActivity } from "@/lib/actions";

export type Activity = Awaited<ReturnType<typeof getActivity>>;
export type Question = Activity["activityToQuestions"][0]["question"];
export type NextActivity = Awaited<ReturnType<typeof getNextActivity>>;