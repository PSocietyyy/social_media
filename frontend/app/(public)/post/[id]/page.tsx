import { PostCard, Post } from "@/components/PostCard";
import { ArrowLeft, MessageSquare, ThumbsUp } from "lucide-react";
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { cookies } from "next/headers";
import { getUserProfile } from "@/lib/api";
import { CommentSection } from "@/components/CommentSection";

dayjs.extend(relativeTime);

interface Comment {
  id: number;
  content: string;
  authorId: number;
  postId: number;
  author: {
    id: number;
    name: string;
    username: string;
    avatar: string | null;
  };
  createdAt: string;
}

interface PostDetail extends Post {
  comments: Comment[];
}

async function getPost(id: string): Promise<PostDetail | null> {
  try {
    const res = await fetch(`http://localhost:3001/posts/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) {
      return null;
    }
    const result = await res.json();
    return result.data;
  } catch (error) {
    console.error("Failed to fetch post", error);
    return null;
  }
}

export default async function PostDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const post = await getPost(params.id);

  const cookieStore = cookies();
  let token = undefined;
  if (typeof cookieStore.then === "function") {
    const resolvedCookies = await cookieStore;
    token = resolvedCookies.get("access_token")?.value;
  } else {
    // @ts-ignore
    token = cookieStore.get("access_token")?.value;
  }

  let user = null;
  if (token) {
    try {
      const res = await getUserProfile(token);
      if (res?.data) {
        user = res.data;
      }
    } catch {}
  }

  if (!post) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8">
        <h2 className="text-xl font-semibold mb-2">Post not found</h2>
        <Link
          href="/"
          className="text-orange-500 hover:underline flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 flex justify-center overflow-y-auto pb-10 scrollbar-hide h-full w-full">
      <div className="w-full max-w-2xl px-2 pt-4">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-700 hover:text-black hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors font-medium mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Kembali</span>
        </Link>

        {/* Post Details using PostCard */}
        <PostCard post={post} isDetail={true} currentUser={user} />

        {/* Comments Section */}
        <CommentSection
          postId={post.id}
          initialComments={post.comments}
          commentCount={post._count?.comments || 0}
          currentUser={user}
        />
      </div>
    </div>
  );
}
