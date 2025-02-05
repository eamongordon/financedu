"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ProfileForm, type ProfileFormValues } from "@/components/account/profile-form";
import { RolesSettingsForm, type RolesFormValues } from "@/components/account/roles-settings-form";
import { LoginSettingsForm, type LoginFormValues } from "@/components/account/login-settings-form";
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

interface SettingsTabsProps {
    profileDefaultValues: ProfileFormValues;
    rolesDefaultValues: RolesFormValues;
    loginDefaultValues: LoginFormValues;
}

export default function SettingsTabs({ profileDefaultValues, rolesDefaultValues, loginDefaultValues }: SettingsTabsProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const tab = searchParams.get('tab');

    useEffect(() => {
        if (!tab) {
            router.push('/account/settings?tab=profile');
        }
    }, [tab, router]);

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
                <LoginSettingsForm defaultValues={loginDefaultValues} />
            </TabsContent>
        </Tabs>
    );
}
