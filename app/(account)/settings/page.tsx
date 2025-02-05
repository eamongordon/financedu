import { type ProfileFormValues } from "@/components/account/profile-form";
import { type RolesFormValues } from "@/components/account/roles-settings-form";
import { type LoginFormValues } from "@/components/account/login-settings-form";
import { auth } from "@/lib/auth";
import { Roles } from "@/lib/schema";
import SettingsTabs from "@/components/account/settings-tabs";

export default async function SettingsPage() {
    const session = await auth();
    if (!session?.user) {
        throw new Error("Not authenticated");
    }

    const profileDefaultValues = {
        firstName: session.user?.firstName || "",
        lastName: session.user?.lastName || "",
    } as ProfileFormValues;

    const rolesDefaultValues = {
        roles: session.user?.roles || ["learner"] as Roles
    } as RolesFormValues;

    const loginDefaultValues = {
        email: session.user?.email || "",
        password: ""
    } as LoginFormValues;

    return (
        <SettingsTabs
            profileDefaultValues={profileDefaultValues}
            rolesDefaultValues={rolesDefaultValues}
            loginDefaultValues={loginDefaultValues}
        />
    );
}