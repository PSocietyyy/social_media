import PostFormPublic from "@/components/PostFormPublic";
import { StoryFeed } from "@/components/StoryFeed";
import { PostCard, Post } from "@/components/PostCard";
import RightSidebarPublic from "@/components/RightSidebarPublic";
import { cookies } from "next/headers";
import { getUserProfile } from "@/lib/api";

async function getPosts(token?: string): Promise<Post[]> {
  if (!token) return []; // Since backend requires auth
  try {
    const res = await fetch("http://localhost:3001/posts?page=1&limit=10", {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      return [];
    }
    const result = await res.json();
    return result.data || [];
  } catch (error) {
    console.error("Failed to fetch posts", error);
    return [];
  }
}

export default async function Home() {
  const cookieStore = cookies();
  let token = undefined;
  if (typeof cookieStore.then === "function") {
    const resolvedCookies = await cookieStore;
    token = resolvedCookies.get("access_token")?.value;
  } else {
    // @ts-ignore
    token = cookieStore.get("access_token")?.value;
  }

  const posts = await getPosts(token);

  let user = null;
  if (token) {
    try {
      const res = await getUserProfile(token);
      if (res?.data) {
        user = res.data;
      }
    } catch {}
  }

  return (
    <div className="w-full h-full flex gap-4 overflow-hidden">
      {/* Main Feed Container */}
      <div className="flex-1 flex flex-col items-center overflow-y-auto pb-10 scrollbar-hide">
        <div className="w-full max-w-2xl px-2">
          {/* Post Form */}
          <PostFormPublic user={user} />

          {/* Tabs */}
          <div className="flex w-full mt-4 border-b border-gray-200">
            <button className="flex-1 py-3 text-center border-b-2 border-orange-500 font-semibold text-gray-900">
              Trending
            </button>
            <button className="flex-1 py-3 text-center border-b-2 border-transparent text-gray-500 font-semibold hover:bg-gray-50">
              Following
            </button>
          </div>

          {/* Story Feed */}
          <StoryFeed />

          {/* Posts Feed */}
          <div className="w-full flex flex-col gap-4 mt-2">
            {posts.length > 0 ? (
              posts.map((post) => (
                <PostCard key={post.id} post={post} currentUser={user} />
              ))
            ) : (
              <div className="w-full p-8 text-center bg-white rounded-xl shadow-sm border border-gray-200 mt-4 text-gray-500">
                No posts available right now.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <RightSidebarPublic />
    </div>
  );
}
