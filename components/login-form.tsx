"use client";

import Image from "next/image";
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type Key, Suspense, useState } from "react";
import { SessionProvider, signIn } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SocialLoginButton from "./social-login-button";
import { createUser } from "@/lib/actions";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { GraduationCap, Apple } from "lucide-react";
import { Role } from "@/lib/schema";
//import { toast } from "sonner";

const Logo = () => (
  <Image
    alt="Financedu Logo"
    width={100}
    height={100}
    className="relative mx-auto h-12 w-auto dark:scale-120 dark:rounded-full dark:border dark:border-stone-400 my-5"
    src="/financedu-icon.svg"
  />
);

const FormHeader = ({ title }: { title: string }) => (
  <h1 className="mt-6 text-center font-medium text-3xl dark:text-white">
    {title}
  </h1>
);

const FormWrapper = ({ children, onSubmit }: { children: React.ReactNode, onSubmit: (e: React.FormEvent<HTMLFormElement>) => void }) => (
  <SessionProvider>
    <form onSubmit={onSubmit} className="flex flex-col space-y-4 mt-8">
      {children}
    </form>
  </SessionProvider>
);

export default function LoginForm() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUri = searchParams.get('redirect');
  const [selected, setSelected] = useState<Key>(pathname);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [sentForgotPasswordEmail, setSentForgotPasswordEmail] = useState(false);
  //const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });

  const handleForgotPasswordToggle = (back: boolean) => {
    setForgotPassword(!back);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      //setLoading(true);
      const formType = selected === "/login" ? "login" : "register";
      if (formType === "login") {
        console.log("submitted login")
        console.log("current email", e.currentTarget.email.value)
        console.log("current password", e.currentTarget.password.value)
        const res = await signIn("credentials", {
          email: e.currentTarget.email.value,
          password: e.currentTarget.password.value,
          redirect: false
        });

        if (res?.error) {
          //setLoading(false);
          router.push("/error")
          //toast.error("Invalid email or password.");
        } else {
          //router.push(redirectUri ? decodeURIComponent(redirectUri) : "/");
          //router.refresh();
        }
      } else if (formType === "register") {
        await createUser({
          email: e.currentTarget.email.value,
          password: e.currentTarget.password.value,
          firstName: e.currentTarget.firstName.value || undefined,
          lastName: e.currentTarget.lastName.value || undefined,
          roles: e.currentTarget.role !== "learner" ? ["learner", e.currentTarget.role as Role] : ["learner"]
        });

        const signInRes = await signIn("credentials", {
          redirect: false,
          email: data.email,
          password: data.password,
        });

        if (signInRes?.error) {
          //setLoading(false);
        } else {
          router.refresh();
          if (redirectUri) {
            router.push(decodeURIComponent(redirectUri));
          } else {
            router.push("/");
          }
        }
      } else {
        await signIn('nodemailer', { redirect: false, email: e.currentTarget.email.value, callbackUrl: '/settings/#new-password' });
        //setLoading(false);
        setSentForgotPasswordEmail(true)
        //toast.success("Email sent! Check your inbox.");
      }
    } catch (error) {
      console.log(error);
      //setLoading(false);
      //toast.error("An error occurred. Please try again.");
    };
  };

  return (
    <div>
      <div className="sm:mx-auto w-full rounded-xl">
        <div aria-label="Shift between Login and Signup forms">
          {selected === "/login" && (
            <div key="/login" title="Log In">
              <Logo />
              {forgotPassword ? (
                <>
                  <FormHeader title="Reset Password" />
                  <p className="text-center text-sm pt-4 px-16">
                    Send a login link to your account&apos;s email.
                  </p>
                  <FormWrapper onSubmit={handleSubmit}>
                    <Input
                      id="email"
                      name="email"
                      placeholder="Email"
                      type="email"
                      autoComplete="email"
                      onChange={(e) => setData({ ...data, email: e.target.value })}
                      className="w-full"
                      required
                    />
                    <Button /*isLoading={loading}*/ type="submit">
                      <p>{sentForgotPasswordEmail ? "Resend Email" : "Send Email"}</p>
                    </Button>
                  </FormWrapper>
                  <p className="text-center text-sm pt-8 pb-8 px-16">
                    <button className="hover:opacity-80 transition-opacity tap-highlight-transparent font-semibold text-sm" onClick={() => handleForgotPasswordToggle(true)}>
                      Back to Login
                    </button>
                  </p>
                </>
              ) : (
                <>
                  <FormHeader title="Welcome Back" />
                  <FormWrapper onSubmit={handleSubmit}>
                    <Input
                      id="email"
                      name="email"
                      placeholder="Email"
                      type="email"
                      autoComplete="email"
                      onChange={(e) => setData({ ...data, email: e.target.value })}
                      className="w-full"
                      required
                    />
                    <Input
                      id="password"
                      name="password"
                      placeholder="Password"
                      type="password"
                      onChange={(e) => setData({ ...data, password: e.target.value })}
                      required
                      className="w-full"
                    />
                    <button type="button" className="hover:opacity-80 transition-opacity tap-highlight-transparent relative inline-flex items-center font-semibold text-sm" onClick={() => handleForgotPasswordToggle(false)}>
                      Forgot Password?
                    </button>
                    <Button /*isLoading={loading}*/ type="submit">
                      <p>Sign In</p>
                    </Button>
                  </FormWrapper>
                  <p className="text-center text-sm pt-8 pb-8 px-16">
                    Don&apos;t have an account?{" "}
                    <Link href="/signup">
                      <button className="hover:opacity-80 transition-opacity tap-highlight-transparent font-semibold text-sm" onClick={() => setSelected("/signup")}>
                        Sign Up
                      </button>
                    </Link>
                    {" "}for free.
                  </p>
                  <hr className="px-2 bg-stone-300" />
                  <div className="flex flex-col mt-8 mb-8">
                    <Suspense fallback={<div className="my-2 h-10 w-full rounded-md border border-stone-200 bg-stone-100 dark:border-stone-700 dark:bg-stone-800" />}>
                      <SocialLoginButton />
                    </Suspense>
                  </div>
                </>
              )}
            </div>
          )}
          {selected === "/signup" && (
            <div key="/signup" title="Sign Up">
              <Logo />
              <FormHeader title="Get Started" />
              <FormWrapper onSubmit={handleSubmit}>
                <RadioGroup id="role" defaultValue="learner" className="grid grid-cols-3 gap-4">
                  <div>
                    <RadioGroupItem value="learner" id="learner" className="peer sr-only" />
                    <Label
                      htmlFor="learner"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <GraduationCap size={24} className="mb-3" />
                      Learner
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="parent" id="parent" className="peer sr-only" />
                    <Label
                      htmlFor="parent"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mb-3"
                      >
                        <path d="M10.102 17.102A4 4 0 0 0 7.291 19.5" />
                        <path d="M13.898 17.102A4 4 0 0 1 16.71 19.5" />
                        <path d="M14.5 9.289A4 4 0 0 0 12 13a4 4 0 0 0-2.5-3.706" />
                        <path d="M19.5 9.297a4 4 0 0 1 2.452 4.318" />
                        <path d="M4.5 9.288a4 4 0 0 0-2.452 4.327" />
                        <circle cx="12" cy="15.5" r="2.5" />
                        <circle cx="17" cy="7" r="3" />
                        <circle cx="7" cy="7" r="3" />
                      </svg>
                      Parent
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="teacher" id="teacher" className="peer sr-only" />
                    <Label
                      htmlFor="teacher"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <Apple size={24} className="mb-3" />
                      Teacher
                    </Label>
                  </div>
                </RadioGroup>
                <div className="flex space-x-4">
                  <Input
                    id="firstName"
                    placeholder="First Name"
                    name="firstName"
                    type="text"
                    className="w-full"
                  />
                  <Input
                    id="lastName"
                    placeholder="Last Name"
                    name="lastName"
                    type="text"
                    className="w-full"
                  />
                </div>
                <Input
                  id="email"
                  name="email"
                  placeholder="Email"
                  type="email"
                  autoComplete="email"
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                  className="w-full"
                  required
                />
                <Input
                  id="password"
                  name="password"
                  placeholder="Password"
                  type="password"
                  onChange={(e) => setData({ ...data, password: e.target.value })}
                  required
                  className="w-full"
                />
                <Button /*isLoading={loading}*/ type="submit">
                  <p>Sign Up</p>
                </Button>
              </FormWrapper>
              <p className="text-center text-sm pt-8 pb-8 px-16">
                Already have an account?{" "}
                <Link href="/login">
                  <button className="hover:opacity-80 transition-opacity tap-highlight-transparent font-semibold text-sm" onClick={() => setSelected("/login")}>
                    Log In
                  </button>
                </Link>
                {" "}instead.
              </p>
              <hr className="px-2 bg-stone-300" />
              <div className="flex flex-col space-y-4 mt-8 mb-8">
                <Suspense fallback={<div className="my-2 h-10 w-full rounded-md border border-stone-200 bg-stone-100 dark:border-stone-700 dark:bg-stone-800" />}>
                  <SocialLoginButton signup />
                </Suspense>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}