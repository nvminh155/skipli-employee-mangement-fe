"use server";

import { TAuthLogin } from "@/types/auth";

import { signIn as naSignIn, signOut as naSignOut } from ".";

export async function signIn(payload: TAuthLogin) {
  const res = await naSignIn("credentials", {
    username: payload.email,
    password: payload.code,
    redirectTo: '/',
    redirect: false,
  });
  return res;
}

export async function signOut() {
  await naSignOut();
}
