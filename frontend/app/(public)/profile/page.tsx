import { cookies } from "next/headers";
import { getUserProfile } from "@/lib/api";
import ProfileForm from "@/components/ProfileForm";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const cookieStore = cookies();
  let token = undefined;

  if (typeof cookieStore.then === "function") {
    const resolvedCookies = await cookieStore;
    token = resolvedCookies.get("access_token")?.value;
  } else {
    // @ts-ignore
    token = cookieStore.get("access_token")?.value;
  }

  if (!token) {
    redirect("/login");
  }

  let user = null;
  try {
    const res = await getUserProfile(token);
    if (res?.data) {
      user = res.data;
    } else {
      redirect("/login");
    }
  } catch (err) {
    redirect("/login");
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center p-4">
      <div className="w-full max-w-4xl py-6 flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Profile Setting</h1>
        <ProfileForm user={user} />
      </div>
    </div>
  );
}
