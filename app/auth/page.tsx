"use client";

import React from "react";
import AuthHeader from "./_components/auth-header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";
import { Form, FormField } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import authService from "@/services/auth.service";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const loginAuthSchema = z.object({
  email: z
    .string()
    .min(1)
    .email()
    .regex(/^[a-zA-Z0-9.@]+$/),
});

type TLoginAuth = z.infer<typeof loginAuthSchema>;
const LoginPage = () => {
  const { setData } = useAuthStore();
  const router = useRouter();
  const form = useForm<TLoginAuth>({
    resolver: zodResolver(loginAuthSchema),
    defaultValues: {
      email: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: TLoginAuth) => {
      return await authService.createAccessCode(data.email);
    },
    onSuccess: () => {
      toast.success("Code sent successfully");
      setData(form.getValues("email"), "");
      router.push("/auth/verify");
    },
    onError: () => {
      toast.error("Code sending failed");
    },
  });

  const onSubmit = (data: TLoginAuth) => {
    mutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Button
          variant="link"
          className="!no-underline hover:text-primary/80 mr-auto flex items-center text-lg"
          onClick={() => router.back()}
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <div>Back</div>
        </Button>
        <AuthHeader
          title="Sign In"
          description="Please enter your email to sign in"
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <Input type="email" placeholder="Enter your email" {...field} />
          )}
        />

        <Button type="submit" className="w-full" disabled={mutation.isPending}>
          Next
        </Button>
      </form>
    </Form>
  );
};

export default LoginPage;
