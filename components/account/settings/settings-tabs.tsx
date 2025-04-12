"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ProfileForm, type ProfileFormValues } from "@/components/account/settings/profile-form";
import { RolesSettingsForm, type RolesFormValues } from "@/components/account/settings/roles-settings-form";
import { LoginSettingsForm, type LoginFormValues } from "@/components/account/settings/login-settings-form";
import { useRouter, useSearchParams } from 'next/navigation';
import { DeleteUserButton } from "./delete-user";

interface SettingsTabsProps {
    profileDefaultValues: ProfileFormValues;
    rolesDefaultValues: RolesFormValues;
    loginDefaultValues: LoginFormValues;
}

export default function SettingsTabs({ profileDefaultValues, rolesDefaultValues, loginDefaultValues }: SettingsTabsProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const tab = searchParams!.get('tab');

    return (
        <Tabs value={tab || 'profile'}>
            <TabsList className="bg-inherit gap-7">
                <TabsTrigger
                    value="profile"
                    onClick={() => router.push('/account/settings?tab=profile')}
                    className="px-0 rounded-none text-md text-foreground font-semibold data-[state=active]:shadow-none data-[state=active]:text-primary border-b-4 border-transparent data-[state=active]:border-primary"
                >
                    Profile
                </TabsTrigger>
                <TabsTrigger
                    value="roles"
                    onClick={() => router.push('/account/settings?tab=roles')}
                    className="px-0 rounded-none text-md text-foreground font-semibold data-[state=active]:shadow-none data-[state=active]:text-primary border-b-4 border-transparent data-[state=active]:border-primary"
                >
                    Roles
                </TabsTrigger>
                <TabsTrigger
                    value="login"
                    onClick={() => router.push('/account/settings?tab=login')}
                    className="px-0 rounded-none text-md text-foreground font-semibold data-[state=active]:shadow-none data-[state=active]:text-primary border-b-4 border-transparent data-[state=active]:border-primary"
                >
                    Login
                </TabsTrigger>
            </TabsList>
            <TabsContent value="profile" className="py-4">
                <ProfileForm defaultValues={profileDefaultValues} />
            </TabsContent>
            <TabsContent value="roles" className="py-4">
                <RolesSettingsForm defaultValues={rolesDefaultValues} />
            </TabsContent>
            <TabsContent value="login" className="py-4">
                <div className="flex flex-col gap-8 divide-y divide-dashed">
                    <LoginSettingsForm defaultValues={loginDefaultValues} />
                    <div className="pt-6 space-y-4" id="delete-account">
                        <h2 className="text-2xl font-semibold">Danger Zone</h2>
                        <div>
                            <DeleteUserButton />
                        </div>
                    </div>
                </div>
            </TabsContent>
        </Tabs>
    );
}
