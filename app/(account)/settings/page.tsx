import { ProfileForm, type ProfileFormValues } from "@/components/account/profile-form";
import { auth } from "@/lib/auth";

export default async function SettingsPage() {
    const session = await auth();
    if (!session?.user) {
        throw new Error("Not authenticated");
    }
    const defaultValues = {
        email: session.user?.email || "",
        firstName: session.user?.firstName || "",
        lastName: session.user?.lastName || "",
    } as ProfileFormValues;
    return (
        <ProfileForm defaultValues={defaultValues} />
    )
}