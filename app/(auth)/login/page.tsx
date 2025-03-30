import type { Metadata } from 'next';
import AuthForm from "@/components/auth/auth-form"

export const metadata: Metadata = {
  title: 'Log In',
  description: 'Log in to your Financedu account.'
}

export default function LoginPage() {
  return (
    <AuthForm page="login" />
  )
}
