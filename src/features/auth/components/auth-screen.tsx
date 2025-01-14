"use client";

import { useState } from "react";
import { SignInFlow } from "../types";

import SignInCard from "./sign-in-card";
import SignUpCard from "./sign-up-card";
import AuthSide from "./auth-side";
import AuthHeader from "./auth-header";
import { cn } from "@/lib/utils";

const AuthScreen = () => {
  const [state, setState] = useState<SignInFlow>("signIn");
  return (
    <div
      className={cn(
        "h-full flex flex-col items-center justify-center bg-[#c9ccd1]/20 ",
        state === "signUp" && "flex-col",
        state === "signIn" && "lg:flex-row md:flex-col md:px-20"
      )}
    >
      {state === "signIn" ? <AuthSide /> : <AuthHeader />}
      <div className="md:h-auto md:w-[420px]">
        {state === "signIn" ? (
          <SignInCard setState={setState} />
        ) : (
          <SignUpCard setState={setState} />
        )}
      </div>
    </div>
  );
};

export default AuthScreen;
