import { RolesSettingsForm, type RolesFormValues } from "@/components/account/roles-settings-form";
import { auth } from "@/lib/auth";
import { Roles } from "@/lib/schema";

export default async function RolesSettingsPage() {
    const session = await auth();
    if (!session?.user) {
        throw new Error("Not authenticated");
    }
    const defaultValues = {
        roles: session.user?.roles || ["learner"] as Roles
    } as RolesFormValues;
    return (
        <RolesSettingsForm defaultValues={defaultValues} />
    )
}