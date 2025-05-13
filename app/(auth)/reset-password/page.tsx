import type { Metadata } from 'next';
import { ResetPasswordForm } from '@/components/account/reset-password-form';

export const metadata: Metadata = {
    title: 'Reset Password'
}

export default async function ResetPasswordPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const token = (await searchParams).token;
    if (!token) {
        throw new Error("Token is required");
    }
    return (
        <ResetPasswordForm token={token as string} />
    )
}
