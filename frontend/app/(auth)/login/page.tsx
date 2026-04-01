import Image from "next/image";
import React from "react";

import loginImage from "@/public/image/login.jpg";
import Brand from "@/components/Brand";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";

const LoginPage = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="w-full grid grid-cols-1 md:grid-cols-2">
        {/* Kiri */}
        <div className="hidden md:block relative w-full bg-white">
          <Image src={loginImage} alt="Login image" />
          <Brand className="absolute top-2 left-2" />
        </div>
        {/* Kanan */}
        <div className="w-full h-full p-2 flex items-center justify-center">
          <Card className="w-[90%]">
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </CardDescription>
              <CardAction>
                <Button>Register</Button>
              </CardAction>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <FieldGroup>
                  <Field className="-space-y-2">
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      type="email"
                      id="email"
                      placeholder="Enter you're email"
                    />
                    <FieldError>Invalid email</FieldError>
                  </Field>
                </FieldGroup>
                <FieldGroup>
                  <Field className="-space-y-2">
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                      type="password"
                      id="password"
                      placeholder="Enter you're password"
                    />
                    <FieldError>Password Required</FieldError>
                  </Field>
                </FieldGroup>
                <div className="w-full flex items-center justify-between px-2">
                  {/* Remember me */}
                  <div className="flex items-center gap-1">
                    <Checkbox id="remember" className="w-5 h-5" />
                    <label htmlFor="remember" className="font-medium">
                      Remember Me
                    </label>
                  </div>
                  {/* Forgot Password */}
                  <Button className="text-blue-700" variant={"link"}>
                    Forgot password?
                  </Button>
                </div>
                <Button className="w-full">Login</Button>
                <p className="text-center">
                  Doesn&apos;t have account?{" "}
                  <Link
                    href={"/register"}
                    className="text-blue-700 font-medium hover:underline"
                  >
                    Register
                  </Link>
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
