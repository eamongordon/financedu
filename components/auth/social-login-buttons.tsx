"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export default function SocialLoginButton({
  signup
}: {
  signup?: boolean;
}) {
  const [isLoadingGoogle, setLoadingGoogle] = useState(false);
  const [isLoadingFacebook, setLoadingFacebook] = useState(false);

  // Get error message added by next/auth in URL.
  const searchParams = useSearchParams();
  const error = searchParams?.get("error");

  useEffect(() => {
    const errorMessage = Array.isArray(error) ? error.pop() : error;
    if (errorMessage) {
      toast.error(errorMessage);
    }
  }, [error]);

  return (
    <div className="flex flex-col gap-4">
      <Button
        disabled={isLoadingGoogle}
        onClick={async () => {
          setLoadingGoogle(true);
          await authClient.signIn.social({
            provider: "google"
          })
        }}
        isLoading={isLoadingGoogle}
        variant="outline"
      >
        {!isLoadingGoogle && (
          <Image
            src="/google-icon.svg"
            alt="Google icon"
            width={20}
            height={20}
          />
        )}
        <p className="text-sm font-medium text-stone-600 dark:text-stone-400">
          {signup ? "Sign Up" : "Log In"} with Google
        </p>
      </Button>
      <Button
        disabled={isLoadingFacebook}
        onClick={async () => {
          setLoadingFacebook(true);
          await authClient.signIn.social({
            provider: "facebook"
          })
        }}
        isLoading={isLoadingFacebook}
        variant="outline"
      >
        {!isLoadingFacebook && (
          <Image
            src="/facebook-icon.svg"
            alt="Facebook icon"
            width={20}
            height={20}
          />
        )}
        <p className="text-sm font-medium text-stone-600 dark:text-stone-400">
          {signup ? "Sign Up" : "Log In"} with Facebook
        </p>
      </Button>
    </div>
  );
}