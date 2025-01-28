import { useState } from "react";
import { useRouter } from "next/navigation";
import { SignInFlow } from "../types";
import { toast } from "sonner";
import { setCookie } from "cookies-next";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { CircleHelp, Eye, EyeClosed, TriangleAlert } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

import { DatePicker } from "./date-picker";
import { UseUserSignUp } from "../api/use-user-signup";

interface SignUpCardProps {
  setState: (state: SignInFlow) => void;
}

const SignUpCard = ({ setState }: SignUpCardProps) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [date, setDate] = useState<Date>();
  const [errorMessages, setErrorMessages] = useState<string[] | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const { signUp, isPending } = UseUserSignUp();

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signUp(
      { firstName, lastName, date, email, password },
      {
        onSuccess: (response) => {
          toast.success(response?.message);

          setState("signIn");
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
    setFirstName("");
    setLastName("");
    setDate(undefined);
    setEmail("");
    setPassword("");
  };

  return (
    <Card className="w-full h-full p-8 bg-[#ffffff] shadow-lg">
      <CardContent className="space-y-5 px-0 pb-0">
        <div className="flex flex-col">
          <div className="flex flex-col gap-y-3 items-center">
            {errorMessages && (
              <div className="w-full p-2 rounded-sm bg-rose-200 space-y-1">
                <TriangleAlert className="size-5 text-rose-500" />
                {errorMessages.map((errorMessage) => (
                  <p key={errorMessage} className="text-sm text-rose-500">
                    {errorMessage}
                  </p>
                ))}
              </div>
            )}

            <Button
              disabled={isPending}
              onClick={() => {}}
              variant="outline"
              className="w-full h-[50px] relative"
            >
              <FcGoogle />
              Sign up with Google
            </Button>

            <Button
              disabled={isPending}
              onClick={() => {}}
              variant="outline"
              className="w-full h-[50px] relative"
            >
              <FaGithub />
              Sign up with GitHub
            </Button>
          </div>

          <div className="separator flex justify-center items-center gap-x-3 py-3">
            <Separator className="w-[43%]" />
            <p className="font-semibold">OR</p>
            <Separator className="w-[43%]" />
          </div>

          <form onSubmit={handleSignUp} className="space-y-3">
            <div className="flex gap-x-3">
              <Input
                className="focus-visible:shadow-md focus-visible:shadow-[#1823ab]"
                disabled={isPending}
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                }}
                type="text"
                placeholder="First Name"
                required
              />

              <Input
                className="focus-visible:shadow-md focus-visible:shadow-[#1823ab]"
                disabled={isPending}
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                }}
                type="text"
                placeholder="Last Name"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex gap-x-1 text-sm font-semibold text-muted-foreground">
                <p>Date of birth</p>
                <Popover>
                  <PopoverTrigger>
                    <CircleHelp className="size-4" />
                  </PopoverTrigger>
                  <PopoverContent>
                    Providing your birthday helps make sure that you get the
                    right Facebook experience for your age.
                  </PopoverContent>
                </Popover>
                <p className="font-normal">(optional)</p>
              </div>

              <DatePicker date={date} setDate={setDate} />
            </div>

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
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                className="absolute right-1"
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
              Sign Up
            </Button>
          </form>

          <div className="flex my-3 gap-1 text-[0.9rem] text-muted-foreground">
            <p>Already have an account?</p>
            <p
              onClick={() => setState("signIn")}
              className="text-sky-700 hover:underline cursor-pointer"
            >
              Sign In
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SignUpCard;
