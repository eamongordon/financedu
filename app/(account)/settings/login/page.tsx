import { LoginSettingsForm, type LoginFormValues } from "@/components/account/login-settings-form";
import { auth } from "@/lib/auth";

export default async function SettingsLoginPage() {
    const session = await auth();
    if (!session?.user) {
        throw new Error("Not authenticated");
    }
    const defaultValues = {
        email: session.user?.email || "",
        password: "",
    } as LoginFormValues;
    return (
        <LoginSettingsForm defaultValues={defaultValues} />
    )
}