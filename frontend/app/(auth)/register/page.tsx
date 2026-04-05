"use client";
import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Eye, EyeClosed } from "lucide-react";

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
import { registerSchema, RegisterSchema } from "@/schemas/registerSchema";
import { registerRequest } from "@/lib/api";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

const RegisterPage = () => {
  const router = useRouter();
  const [isPasswordType, setIsPasswordType] = useState<boolean>(true);
  const [isConfirmPasswordType, setIsConfirmPasswordType] =
    useState<boolean>(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterSchema) => {
    try {
      await registerRequest(data);
      toast.success("Registration successful!");
      router.push("/login");
    } catch (error: any) {
      toast.error(error.message || "Registration failed");
    }
  };

  const togglePasswordType = () => {
    setIsPasswordType(!isPasswordType);
  };

  const toggleConfirmPasswordType = () => {
    setIsConfirmPasswordType(!isConfirmPasswordType);
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="w-full grid grid-cols-1 md:grid-cols-2">
        {/* Kiri */}
        <div className="w-full h-full p-2 flex items-center justify-center overflow-auto max-h-screen">
          <Card className="w-[90%] my-auto mt-4 mb-4">
            <CardHeader>
              <CardTitle>Register</CardTitle>
              <CardDescription>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </CardDescription>
              <CardAction>
                <Button asChild variant="outline">
                  <Link href="/login">Login</Link>
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <FieldGroup>
                  <Field className="-space-y-2">
                    <FieldLabel htmlFor="name">Name</FieldLabel>
                    <Input
                      type="text"
                      id="name"
                      placeholder="Enter your name"
                      {...register("name")}
                    />
                    {errors.name?.message && (
                      <FieldError>{errors.name.message}</FieldError>
                    )}
                  </Field>
                </FieldGroup>
                <FieldGroup>
                  <Field className="-space-y-2">
                    <FieldLabel htmlFor="username">Username</FieldLabel>
                    <Input
                      type="text"
                      id="username"
                      placeholder="Enter your username"
                      {...register("username")}
                    />
                    {errors.username?.message && (
                      <FieldError>{errors.username.message}</FieldError>
                    )}
                  </Field>
                </FieldGroup>
                <FieldGroup>
                  <Field className="-space-y-2">
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      type="email"
                      id="email"
                      placeholder="Enter your email"
                      {...register("email")}
                    />
                    {errors.email?.message && (
                      <FieldError>{errors.email.message}</FieldError>
                    )}
                  </Field>
                </FieldGroup>
                <FieldGroup>
                  <Field className="-space-y-2">
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <InputGroup className="w-full">
                      <InputGroupInput
                        placeholder="Enter your password"
                        id="password"
                        type={isPasswordType ? "password" : "text"}
                        {...register("password")}
                      />
                      <InputGroupAddon align={"inline-end"}>
                        <Button
                          type="button"
                          onClick={togglePasswordType}
                          variant={"link"}
                          size={"icon-sm"}
                        >
                          {isPasswordType ? <Eye /> : <EyeClosed />}
                        </Button>
                      </InputGroupAddon>
                    </InputGroup>
                    {errors.password?.message && (
                      <FieldError>{errors.password.message}</FieldError>
                    )}
                  </Field>
                </FieldGroup>
                <FieldGroup>
                  <Field className="-space-y-2">
                    <FieldLabel htmlFor="confirmPassword">
                      Confirm Password
                    </FieldLabel>
                    <InputGroup className="w-full">
                      <InputGroupInput
                        placeholder="Confirm your password"
                        id="confirmPassword"
                        type={isConfirmPasswordType ? "password" : "text"}
                        {...register("confirmPassword")}
                      />
                      <InputGroupAddon align={"inline-end"}>
                        <Button
                          type="button"
                          onClick={toggleConfirmPasswordType}
                          variant={"link"}
                          size={"icon-sm"}
                        >
                          {isConfirmPasswordType ? <Eye /> : <EyeClosed />}
                        </Button>
                      </InputGroupAddon>
                    </InputGroup>
                    {errors.confirmPassword?.message && (
                      <FieldError>{errors.confirmPassword.message}</FieldError>
                    )}
                  </Field>
                </FieldGroup>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Registering..." : "Register"}
                </Button>
                <p className="text-center">
                  Already have an account?{" "}
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
        <div className="hidden md:flex items-center justify-center relative w-full h-screen bg-white">
          <Image
            src={RegisterImage}
            alt="Register image"
            className="object-cover w-full h-full"
          />
          <Brand className="absolute top-2 left-2" />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
