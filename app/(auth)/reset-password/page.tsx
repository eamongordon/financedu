import type { Metadata } from 'next';
import AuthForm from "@/components/auth/auth-form"

export const metadata: Metadata = {
  title: 'Reset Password'
}

export default function LoginPage() {
  return (
    <AuthForm page="reset-password" />
  )
}
