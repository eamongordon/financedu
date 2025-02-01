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
import { toast } from "sonner";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

const ResetEmailFormSchema = z.object({
  email: z.string().email()
});

const LoginFormSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

const SignupFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  role: z.enum(["learner", "parent", "teacher"])
});

const Logo = () => (
  <Image
    alt="Financedu Logo"
    width={75}
    height={75}
    className="relative mx-auto h-12 w-auto my-5"
    src="/financedu-icon.svg"
  />
);

const FormHeader = ({ title }: { title: string }) => (
  <h1 className="mt-6 text-center font-medium text-3xl dark:text-white">
    {title}
  </h1>
);

export default function LoginForm() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUri = searchParams.get('redirect');
  const [selected, setSelected] = useState<Key>(pathname);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [sentForgotPasswordEmail, setSentForgotPasswordEmail] = useState(false);
  const [loading, setLoading] = useState(false);

  const resetEmailForm = useForm<z.infer<typeof ResetEmailFormSchema>>({
    resolver: zodResolver(ResetEmailFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const loginForm = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: ""
    },
  });

  const signupForm = useForm<z.infer<typeof SignupFormSchema>>({
    resolver: zodResolver(SignupFormSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      role: "learner"
    },
  });

  const handleForgotPasswordToggle = (back: boolean) => {
    setForgotPassword(!back);
  };

  async function onResetEmailFormSubmit(data: z.infer<typeof ResetEmailFormSchema>) {
    try {
      setLoading(true);
      await signIn('nodemailer', { redirect: false, email: data.email, callbackUrl: '/settings/#new-password' });
      setLoading(false);
      setSentForgotPasswordEmail(true)
      toast.success("Email sent! Check your inbox.");
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error("An error occurred. Please try again.");
    }
  };

  async function onLoginFormSubmit(data: z.infer<typeof LoginFormSchema>) {
    try {
      setLoading(true);
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false
      });

      if (res?.error) {
        setLoading(false);
        toast.error("Invalid email or password.");
      } else {
        router.push(redirectUri ? decodeURIComponent(redirectUri) : "/");
        router.refresh();
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error("An error occurred. Please try again.");
    }
  };

  async function onSignupFormSubmit(data: z.infer<typeof SignupFormSchema>) {
    try {
      setLoading(true);
      await createUser({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        roles: data.role !== "learner" ? ["learner", data.role as Role] : ["learner"]
      });

      const signInRes = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (signInRes?.error) {
        setLoading(false);
      } else {
        router.refresh();
        if (redirectUri) {
          router.push(decodeURIComponent(redirectUri));
        } else {
          router.push("/");
        }
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error("An error occurred. Please try again.");
    }
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
                  <SessionProvider>
                    <Form {...resetEmailForm}>
                      <form onSubmit={resetEmailForm.handleSubmit(onResetEmailFormSubmit)} className="flex flex-col space-y-4 mt-8">
                        <FormField
                          control={resetEmailForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input autoComplete="email" placeholder="Email Address" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button isLoading={loading} type="submit">
                          <p>{sentForgotPasswordEmail ? "Resend Email" : "Send Email"}</p>
                        </Button>
                      </form>
                    </Form>
                  </SessionProvider>
                  <p className="text-center text-sm pt-8 pb-8 px-16">
                    <button className="hover:opacity-80 transition-opacity tap-highlight-transparent font-semibold text-sm" onClick={() => handleForgotPasswordToggle(true)}>
                      Back to Login
                    </button>
                  </p>
                </>
              ) : (
                <>
                  <FormHeader title="Welcome Back" />
                  <SessionProvider>
                    <Form {...loginForm}>
                      <form onSubmit={loginForm.handleSubmit(onLoginFormSubmit)} className="flex flex-col space-y-4 mt-8">
                        <FormField
                          control={loginForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input className="w-full" type="email" autoComplete="email" placeholder="Email Address" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={loginForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input className="w-full" type="password" placeholder="Password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <button type="button" className="hover:opacity-80 transition-opacity tap-highlight-transparent relative inline-flex items-center font-semibold text-sm" onClick={() => handleForgotPasswordToggle(false)}>
                          Forgot Password?
                        </button>
                        <Button isLoading={loading} type="submit">
                          <p>Sign In</p>
                        </Button>
                      </form>
                    </Form>
                  </SessionProvider>
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
              <SessionProvider>
                <Form {...signupForm}>
                  <form onSubmit={signupForm.handleSubmit(onSignupFormSubmit)} className="flex flex-col space-y-4 mt-8">
                    <FormField
                      control={signupForm.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-3 gap-4">
                            <FormItem>
                              <FormControl>
                                <RadioGroupItem value="learner" id="learner" className="peer sr-only" />
                              </FormControl>
                              <Label
                                htmlFor="learner"
                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                              >
                                <GraduationCap size={24} className="mb-3" />
                                Learner
                              </Label>
                            </FormItem>
                            <FormItem>
                              <FormControl>
                                <RadioGroupItem value="parent" id="parent" className="peer sr-only" />
                              </FormControl>
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
                            </FormItem>
                            <FormItem>
                              <FormControl>
                                <RadioGroupItem value="teacher" id="teacher" className="peer sr-only" />
                              </FormControl>
                              <Label
                                htmlFor="teacher"
                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                              >
                                <Apple size={24} className="mb-3" />
                                Teacher
                              </Label>
                            </FormItem>
                          </RadioGroup>
                        </FormItem>
                      )}
                    />
                    <div className="flex space-x-4">
                      <FormField
                        control={signupForm.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input placeholder="First Name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={signupForm.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input placeholder="Last Name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={signupForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input type="email" autoComplete="email" placeholder="Email Address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={signupForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input type="password" placeholder="Password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button isLoading={loading} type="submit">
                      <p>Sign Up</p>
                    </Button>
                  </form>
                </Form>
              </SessionProvider>
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
    </div >
  );
}