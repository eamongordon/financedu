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
            router.push('/settings?tab=profile');
        }
    }, [tab, router]);

    return (
        <Tabs value={tab || 'profile'}>
            <TabsList className="bg-inherit gap-6">
                <TabsTrigger
                    value="profile"
                    onClick={() => router.push('/settings?tab=profile')}
                    className="px-0 rounded-none text-md text-foreground font-semibold data-[state=active]:shadow-none data-[state=active]:text-primary border-b-4 border-transparent data-[state=active]:border-primary"
                >
                    Profile
                </TabsTrigger>
                <TabsTrigger
                    value="roles"
                    onClick={() => router.push('/settings?tab=roles')}
                    className="px-0 rounded-none text-md text-foreground font-semibold data-[state=active]:shadow-none data-[state=active]:text-primary border-b-4 border-transparent data-[state=active]:border-primary"
                >
                    Roles
                </TabsTrigger>
                <TabsTrigger
                    value="login"
                    onClick={() => router.push('/settings?tab=login')}
                    className="px-0 rounded-none text-md text-foreground font-semibold data-[state=active]:shadow-none data-[state=active]:text-primary border-b-4 border-transparent data-[state=active]:border-primary"
                >
                    Login
                </TabsTrigger>
            </TabsList>
            <TabsContent value="profile" className="py-4">
                <ProfileForm defaultValues={profileDefaultValues} />
            </TabsContent>
            <TabsContent value="roles">
                <RolesSettingsForm defaultValues={rolesDefaultValues} />
            </TabsContent>
            <TabsContent value="login">
                <LoginSettingsForm defaultValues={loginDefaultValues} />
            </TabsContent>
        </Tabs>
    );
}
