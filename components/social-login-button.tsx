"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function SocialLoginButton({
  signup
}: {
  signup?: boolean;
}) {
  const [loading, setLoading] = useState(false);

  // Get error message added by next/auth in URL.
  const searchParams = useSearchParams();
  const error = searchParams?.get("error");

  useEffect(() => {
    //const errorMessage = Array.isArray(error) ? error.pop() : error;
    //errorMessage && toast.error(errorMessage);
  }, [error]);

  return (
    <>
      <Button
        disabled={loading}
        onClick={() => {
          setLoading(true);
          signIn("google");
        }}
        className={`${loading
            ? "cursor-not-allowed bg-stone-50 dark:bg-stone-800"
            : "bg-white hover:bg-stone-50 active:bg-stone-100 dark:bg-black dark:hover:border-white dark:hover:bg-black"
          } group my-2 flex h-10 w-full items-center justify-center space-x-2 rounded-md border border-stone-200 transition-colors duration-75 focus:outline-none dark:border-stone-700`}
      >
        {loading ? (
          <></>
        ) : (
          <>
            <Image
              src="/google-icon.svg"
              alt="Google icon"
              width={20}
              height={20}
            />
            <p className="text-sm font-medium text-stone-600 dark:text-stone-400">
              {signup ? "Sign Up" : "Log In"} with Google
            </p>
          </>
        )}
      </Button>
      <Button
        disabled={loading}
        onClick={() => {
          setLoading(true);
          signIn("facebook");
        }}
        className={`${loading
            ? "cursor-not-allowed bg-stone-50 dark:bg-stone-800"
            : "bg-white hover:bg-stone-50 active:bg-stone-100 dark:bg-black dark:hover:border-white dark:hover:bg-black"
          } group my-2 flex h-10 w-full items-center justify-center space-x-2 rounded-md border border-stone-200 transition-colors duration-75 focus:outline-none dark:border-stone-700`}
      >
        {loading ? (
          <></>
        ) : (
          <>
            <Image
              src="/facebook-icon.svg"
              alt="Facebook icon"
              width={20}
              height={20}
            />
            <p className="text-sm font-medium text-stone-600 dark:text-stone-400">
              {signup ? "Sign Up" : "Log In"} with Facebook
            </p>
          </>
        )}
      </Button>
    </>
  );
}