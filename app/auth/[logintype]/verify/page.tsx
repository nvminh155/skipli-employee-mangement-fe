"use client";

import React, { useEffect, useRef, useState } from "react";
import AuthHeader from "../_components/auth-header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import authService from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth.store";
import { toast } from "sonner";
import { signIn } from "@/auth/helper";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";

const RESEND_COOL_DOWN = 60;
const VerificationPage = () => {
  const { email, code, clearData, setData } = useAuthStore();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async () => {
      return await signIn({ email, code });
    },
    onSuccess: () => {
      toast.success("Logged in successfully");
      clearData();
      router.push("/");
    },
    onError: () => {
      toast.error("Logged in failed");
    },
  });

  return (
    <div className="space-y-4">
      <Button variant="link" className="!no-underline hover:text-primary/80 mr-auto flex items-center text-lg" onClick={() => router.back()}>
        <ArrowLeftIcon className="w-5 h-5" />
        <div>Back</div>
      </Button>
      <AuthHeader
        title="Email verification"
        description="Please enter your code that send to your email"
      />
      <Input type="number" placeholder="Enter your code" value={code} onChange={(e) => setData(email, e.target.value)} />

      <Button onClick={() => mutation.mutate()} disabled={mutation.isPending} className="w-full">
        Submit
      </Button>

      <div className="flex items-center gap-1">
        <span>Code not receive?</span>
        <ResendCodeButton />
      </div>
    </div>
  );
};

const ResendCodeButton = () => {
  const [coolDown, setCoolDown] = useState(-1);
  const timeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { email } = useAuthStore();

  const mutation = useMutation({
    mutationFn: () => {
      return authService.createAccessCode(email);
    },
    onSuccess: () => {
      toast.success("Sent code successfully");
    },
    onError: () => {
      toast.error("Sent code failed");
    },
    onSettled: () => {
      setCoolDown(RESEND_COOL_DOWN);
    },
  });

  useEffect(() => {
    if (coolDown < 0) {
      if (timeIntervalRef.current) clearInterval(timeIntervalRef.current);
      return;
    }

    timeIntervalRef.current = setInterval(
      () => setCoolDown(coolDown - 1),
      1000
    );

    return () => {
      if (timeIntervalRef.current) clearInterval(timeIntervalRef.current);
    };
  }, [coolDown]);

  return (
    <Button
      variant="link"
      onClick={() => mutation.mutate()}
      disabled={mutation.isPending || coolDown >= 0}
    >
      Send again {coolDown >= 0 ? `(${coolDown})` : ""}
    </Button>
  );
};

export default VerificationPage;
