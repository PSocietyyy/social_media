import { cookies } from "next/headers";
import { getUserProfile } from "@/lib/api";
import { redirect } from "next/navigation";
import ProfileForm from "@/components/ProfileForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function ProfileEditPage() {
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
    user = res.data;
  } catch (error) {
    console.error("Failed to fetch profile", error);
    redirect("/login");
  }

  return (
    <div className="flex-1 flex flex-col items-center overflow-y-auto pb-10 scrollbar-hide">
      <div className="w-full max-w-2xl px-2 py-6">
        <Link
          href="/profile"
          className="inline-flex items-center gap-2 text-gray-700 hover:text-black mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Profile
        </Link>
        <ProfileForm user={user} />
      </div>
    </div>
  );
}
