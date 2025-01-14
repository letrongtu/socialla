import { useState } from "react";
import { SignInFlow } from "../types";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

import { Eye, EyeClosed } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

interface SignInCardProps {
  setState: (state: SignInFlow) => void;
}

const SignInCard = ({ setState }: SignInCardProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <Card className="w-full h-full p-8 bg-[#ffffff] shadow-lg">
      <CardContent className="space-y-5 px-0 pb-0">
        <form className="space-y-3">
          <Input
            className="focus-visible:shadow-md focus-visible:shadow-[#283959]"
            disabled={false}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            type="email"
            placeholder="Email address"
            required
          />

          <div className="flex relative items-center">
            <Input
              className="focus-visible:shadow-md focus-visible:shadow-[#283959]"
              disabled={false}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              type={isPasswordVisible ? "text" : "password"}
              placeholder="Password"
              required
            />
            <Button
              disabled={false}
              variant="transparent"
              type="button"
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              className="absolute right-1"
            >
              {isPasswordVisible ? <Eye /> : <EyeClosed />}
            </Button>
          </div>

          <Button
            disabled={false}
            type="submit"
            className="w-full h-[50px] bg-[#283959] text-lg"
            size="lg"
            variant="socialla"
          >
            Login
          </Button>
        </form>

        <div className="flex flex-col">
          <p className="text-sm text-sky-700 cursor-pointer hover:underline">
            Forgotten password?
          </p>

          <Separator className="mt-3 mb-4" />

          <div className="flex flex-col gap-y-3 items-center">
            <Button
              disabled={false}
              onClick={() => {}}
              variant="outline"
              className="w-full h-[50px] relative"
            >
              <FcGoogle />
              Sign in with Google
            </Button>

            <Button
              disabled={false}
              onClick={() => {}}
              variant="outline"
              className="w-full h-[50px] relative"
            >
              <FaGithub />
              Sign in with GitHub
            </Button>
          </div>

          <div className="flex my-3 gap-1 text-[0.9rem] text-muted-foreground">
            <p>Don&apos;t have an account?</p>
            <p
              onClick={() => setState("signUp")}
              className="text-sky-700 hover:underline cursor-pointer"
            >
              Create an account
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SignInCard;
