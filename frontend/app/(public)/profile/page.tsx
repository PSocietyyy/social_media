import { cookies } from "next/headers";
import { getUserProfile } from "@/lib/api";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Settings, Grid3X3, ArrowLeft } from "lucide-react";
import { PostCard } from "@/components/PostCard";

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
    user = res.data;
  } catch (error) {
    console.error("Failed to fetch profile", error);
    redirect("/login");
  }

  if (!user) return null;

  return (
    <div className="flex-1 flex flex-col items-center overflow-y-auto pb-10 scrollbar-hide w-full h-full">
      <div className="w-full max-w-3xl px-4 py-8">
        {/* Header Section (Instagram Like) */}
        <div className="flex items-start md:items-center gap-8 md:gap-16 mb-12">
          {/* Avatar */}
          <div className="w-24 h-24 md:w-36 md:h-36 shrink-0 rounded-full bg-gray-200 overflow-hidden shadow-sm border border-gray-100 flex items-center justify-center">
            {user.avatar ? (
              <img
                src={user.avatar}
                className="object-cover w-full h-full"
                alt="avatar"
              />
            ) : (
              <span className="text-gray-500 text-4xl">
                {user.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          {/* Stats and Info */}
          <div className="flex-1 flex flex-col">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
              <h2 className="text-xl font-semibold">{user.username}</h2>
              <div className="flex gap-2">
                <Link
                  href="/profile/edit"
                  className="bg-gray-100 hover:bg-gray-200 font-semibold px-4 py-1.5 rounded-lg text-sm transition-colors"
                >
                  Edit Profile
                </Link>
                <button className="bg-gray-100 hover:bg-gray-200 p-1.5 rounded-lg transition-colors">
                  <Settings className="w-5 h-5 text-gray-800" />
                </button>
              </div>
            </div>

            <div className="flex gap-6 mb-4">
              <div className="flex gap-1">
                <span className="font-semibold">{user._count?.posts || 0}</span>
                <span className="text-gray-900">posts</span>
              </div>
              <div className="flex gap-1">
                <span className="font-semibold">
                  {user._count?.followers || 0}
                </span>
                <span className="text-gray-900">followers</span>
              </div>
              <div className="flex gap-1">
                <span className="font-semibold">
                  {user._count?.following || 0}
                </span>
                <span className="text-gray-900">following</span>
              </div>
            </div>

            <div className="flex flex-col">
              <span className="font-semibold text-[15px]">{user.name}</span>
              {user.bio && (
                <span className="text-sm mt-1 whitespace-pre-wrap">
                  {user.bio}
                </span>
              )}
              <span className="text-xs text-gray-500 mt-1 capitalize">
                {user.role.toLowerCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Divider */}
        <div className="border-t border-gray-200 w-full flex justify-center mt-4">
          <div className="flex items-center gap-2 border-t-2 border-black pt-4 -mt-[1px]">
            <Grid3X3 className="w-4 h-4" />
            <span className="text-sm font-semibold tracking-widest uppercase">
              POSTS
            </span>
          </div>
        </div>

        {/* Posts Grid List */}
        <div className="mt-8">
          {user.posts && user.posts.length > 0 ? (
            <div className="flex flex-col gap-4">
              {user.posts.map((post: any) => (
                <PostCard key={post.id} post={post} currentUser={user} />
              ))}
            </div>
          ) : (
            <div className="w-full text-center py-20 text-gray-500">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border-2 border-black mb-4">
                <Grid3X3 className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-bold text-black mb-2">
                Belum ada post
              </h3>
              <p>Segera bagikan momen spesial Anda.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
