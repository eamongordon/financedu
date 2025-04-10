import type { Metadata } from 'next';
import { type ProfileFormValues } from "@/components/account/profile-form";
import { type RolesFormValues } from "@/components/account/roles-settings-form";
import { type LoginFormValues } from "@/components/account/login-settings-form";
import { auth } from "@/lib/auth";
import { Roles } from "@/lib/db/schema";
import SettingsTabs from "@/components/account/settings-tabs";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
    title: 'Account Settings'
}

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
        <main>
            <div className="space-y-0.5">
                <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
                <p className="text-muted-foreground">
                    Manage your account settings and set e-mail preferences.
                </p>
            </div>
            <Separator className="my-6" />
            <SettingsTabs
                profileDefaultValues={profileDefaultValues}
                rolesDefaultValues={rolesDefaultValues}
                loginDefaultValues={loginDefaultValues}
            />
        </main>
    );
}