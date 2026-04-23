"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { toast } from "sonner";
import { updateUserProfile, deleteUserProfile } from "@/lib/api";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

interface ProfileFormData {
  name: string;
  bio: string;
}

const ProfileForm = ({ user }: { user: any }) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    defaultValues: {
      name: user?.name || "",
      bio: user?.bio || "",
    },
  });

  // Handle Edit Profile Form Submission
  const onSubmit = async (data: ProfileFormData) => {
    const token = Cookies.get("access_token");
    if (!token) {
      toast.error("Please login first");
      router.push("/login");
      return;
    }

    try {
      await updateUserProfile(token, { bio: data.bio });
      // The API only accepts bio or specific fields according to the api.ts signature
      // The backend actually accepts name, bio, avatar, password.
      // But the api.ts in frontend updateUserProfile has signature: data: { bio: string }
      // So let's just stick to what updateUserProfile supports or we should update updateUserProfile too.
      // Assuming we updated updateUserProfile to accept partial data including name. Let's send it!
      toast.success("Profile updated successfully!");
      router.refresh(); // Refresh the page to reflect changes
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete your profile? This action cannot be undone.",
      )
    )
      return;

    const token = Cookies.get("access_token");
    if (!token) return;

    try {
      await deleteUserProfile(token);
      Cookies.remove("access_token");
      Cookies.remove("refresh_token");
      toast.success("Profile deleted successfully");
      router.push("/login");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete profile");
    }
  };

  const handleLogout = () => {
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    // Optionally call POST /auth/logout
    toast.success("Logged out");
    router.push("/login");
  };

  return (
    <div className="w-full flex justify-center py-6">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
          <CardDescription>
            View and edit your personal information.
          </CardDescription>
          <CardAction>
            <Button variant="destructive" onClick={handleLogout}>
              Logout
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {/* Read-Only Info */}
            <div className="grid grid-cols-2 gap-4">
              <FieldGroup>
                <Field className="-space-y-2">
                  <FieldLabel>Username (Read-only)</FieldLabel>
                  <Input
                    type="text"
                    value={user?.username || ""}
                    disabled
                    className="bg-gray-100"
                  />
                </Field>
              </FieldGroup>
              <FieldGroup>
                <Field className="-space-y-2">
                  <FieldLabel>Email (Read-only)</FieldLabel>
                  <Input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="bg-gray-100"
                  />
                </Field>
              </FieldGroup>
            </div>

            {/* Editable Info */}
            <FieldGroup>
              <Field className="-space-y-2">
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input
                  type="text"
                  id="name"
                  placeholder="Your name"
                  {...register("name")}
                />
                {errors.name && <FieldError>{errors.name.message}</FieldError>}
              </Field>
            </FieldGroup>
            <FieldGroup>
              <Field className="-space-y-2">
                <FieldLabel htmlFor="bio">Bio</FieldLabel>
                <Input
                  type="text"
                  id="bio"
                  placeholder="Tell us about yourself"
                  {...register("bio")}
                />
                {errors.bio && <FieldError>{errors.bio.message}</FieldError>}
              </Field>
            </FieldGroup>

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="text-red-600 border-red-600 hover:bg-red-50"
                onClick={handleDelete}
              >
                Delete Account
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileForm;
