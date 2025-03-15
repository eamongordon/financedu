import type { Metadata } from 'next';
import AuthForm from "@/components/auth/auth-form"

export const metadata: Metadata = {
  title: 'Sign Up',
  description: 'Join Financedu and access all the financial literacy courses and resources we have to offer—for free.'
}

export default function LoginPage() {
  return (
    <AuthForm />
  )
}
