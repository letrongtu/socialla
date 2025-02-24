import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { setCookie } from "cookies-next";
import { SignInFlow } from "../types";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

import { Eye, EyeClosed, TriangleAlert } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

import { UseUserLogin } from "../api/use-user-login";

interface SignInCardProps {
  setState: (state: SignInFlow) => void;
}

const SignInCard = ({ setState }: SignInCardProps) => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [errorMessages, setErrorMessages] = useState<string[] | null>(null);

  const { login, isPending } = UseUserLogin();

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login(
      { email, password },
      {
        onSuccess: (response) => {
          toast.success(response?.message);
          if (response?.token) {
            setCookie("token", response.token, { maxAge: 60 * 60 * 24 });
          }

          if (response?.userId) {
            setCookie("userId", response.userId, { maxAge: 60 * 60 * 24 });
          }

          router.push("/");
          clearForm();
        },
        onError: (error) => {
          if (Array.isArray(error.response?.data)) {
            const errorMessages = error.response?.data.map(
              (error) => error.description
            );
            setErrorMessages(errorMessages);
          } else {
            setErrorMessages([error.response?.data as string]);
          }
        },
        onSettled: () => {
          setTimeout(() => {
            setErrorMessages(null);
          }, 5000);
        },
      }
    );
  };

  const clearForm = () => {
    setEmail("");
    setPassword("");
  };

  return (
    <Card className="w-full h-full p-8 bg-[#ffffff] shadow-lg">
      <CardContent className="space-y-5 px-0 pb-0">
        {errorMessages && (
          <div className="w-full p-2 rounded-sm bg-rose-200 space-y-1">
            <TriangleAlert className="size-5 text-rose-500" />
            {errorMessages.map((errorMessage, index) => (
              <p key={index} className="text-sm text-rose-500">
                {errorMessage}
              </p>
            ))}
          </div>
        )}

        <form onSubmit={handleSignIn} className="space-y-3">
          <Input
            className="focus-visible:shadow-md focus-visible:shadow-[#1823ab]"
            disabled={isPending}
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
              className="focus-visible:shadow-md focus-visible:shadow-[#1823ab]"
              disabled={isPending}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              type={isPasswordVisible ? "text" : "password"}
              placeholder="Password"
              required
            />
            <Button
              disabled={isPending}
              variant="transparent"
              type="button"
              onClick={() => setIsPasswordVisible((prev) => !prev)}
              className="absolute right-1 bg-[#ffffff] hover:bg-[#ffffff]"
            >
              {isPasswordVisible ? <Eye /> : <EyeClosed />}
            </Button>
          </div>

          <Button
            disabled={isPending}
            type="submit"
            className="w-full h-[50px] bg-[#1823ab] text-lg"
            size="lg"
            variant="socialla"
          >
            Login
          </Button>
        </form>

        <div className="flex flex-col">
          <p
            onClick={() => router.push("/notfound")}
            className="text-sm text-sky-700 cursor-pointer hover:underline"
          >
            Forgotten password?
          </p>

          <Separator className="mt-3 mb-4" />

          <div className="flex flex-col gap-y-3 items-center">
            <Button
              disabled={isPending}
              onClick={() => router.push("/notfound")}
              variant="outline"
              className="w-full h-[50px] relative"
            >
              <FcGoogle />
              Sign in with Google
            </Button>

            <Button
              disabled={isPending}
              onClick={() => router.push("/notfound")}
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
