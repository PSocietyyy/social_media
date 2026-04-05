"use client";
import Image from "next/image";
import React, { useState } from "react";

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
import { useRouter } from "next/navigation";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { loginSchema, LoginSchema } from "@/schemas/loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Eye, EyeClosed } from "lucide-react";
import { toast } from "sonner";
import { loginRequest } from "@/lib/api";

const LoginPage = () => {
  const router = useRouter();
  const [isPasswordType, setIsPasswordType] = useState<boolean>(true);
  // HookForm
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  // handle submit
  const onSubmit = async (data: LoginSchema) => {
    try {
      const response = await loginRequest(data);
      if (response && response.data && response.data.token) {
        localStorage.setItem("token", response.data.token);
      } else if (response && response.token) {
        // Depending on actual response structure
        localStorage.setItem("token", response.token);
      }
      toast.success("Login successful!");
      router.push("/");
    } catch (error: any) {
      toast.error(error.message || "Login failed");
    }
  };

  // hanlde See Password
  const togglePasswordType = () => {
    setIsPasswordType(!isPasswordType);
  };
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
              <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <FieldGroup>
                  <Field className="-space-y-2">
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      type="email"
                      id="email"
                      placeholder="Enter you're email"
                      {...register("email")}
                    />
                    {errors.email?.message && (
                      <FieldError>{errors.email.message}</FieldError>
                    )}
                  </Field>
                </FieldGroup>
                {/* Password */}
                <FieldGroup>
                  <Field className="-space-y-2">
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <InputGroup className="w-full">
                      <InputGroupInput
                        placeholder="Enter you're password"
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
                <Button type="submit" className="w-full">
                  {isSubmitting ? "Loading" : "Login"}
                </Button>
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
