import Image from "next/image";
import React from "react";

import RegisterImage from "@/public/image/register.jpg";
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
import Link from "next/link";

const RegisterPage = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="w-full grid grid-cols-1 md:grid-cols-2">
        {/* Kiri */}
        <div className="w-full h-full p-2 flex items-center justify-center">
          <Card className="w-[90%]">
            <CardHeader>
              <CardTitle>Register</CardTitle>
              <CardDescription>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </CardDescription>
              <CardAction>
                <Button>Login</Button>
              </CardAction>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <FieldGroup>
                  <Field className="-space-y-2">
                    <FieldLabel htmlFor="name">Username</FieldLabel>
                    <Input
                      type="name"
                      id="name"
                      placeholder="Enter you're username"
                    />
                    <FieldError>Invalid name</FieldError>
                  </Field>
                </FieldGroup>
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

                <Button className="w-full">Register</Button>
                <p className="text-center">
                  Already have account?{" "}
                  <Link
                    href={"/login"}
                    className="text-blue-700 font-medium hover:underline"
                  >
                    Login
                  </Link>
                </p>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Kanan */}
        <div className="hidden md:flex items-center justify-center relative w-full h-screen bg-white ">
          <Image src={RegisterImage} alt="Login image" className="w-full" />
          <Brand className="absolute top-2 left-2" />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
