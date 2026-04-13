import { PostCard, Post } from "@/components/PostCard";
import { ArrowLeft, MessageSquare, ThumbsUp } from "lucide-react";
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

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
        <PostCard post={post} isDetail={true} />

        {/* Comments Section */}
        <div className="bg-white rounded-xl border shadow-sm p-4 mt-4">
          <h4 className="font-semibold text-lg mb-4">
            Comments{" "}
            <span className="text-gray-500 font-normal">
              {post._count?.comments || 0}
            </span>
          </h4>

          <div className="flex gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
              {/* Current User Dummy Avatar instead of null */}
              <img
                src={`https://i.pravatar.cc/150?u=me`}
                alt="Me"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col w-full flex-1 gap-2">
              <input
                type="text"
                placeholder="Write a comment..."
                className="w-full border-b border-gray-300 px-1 py-2 text-sm focus:outline-none focus:border-orange-500 transition-colors"
              />
              <div className="flex justify-end">
                <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors">
                  Post Comment
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {post.comments && post.comments.length > 0 ? (
              post.comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                    {comment.author.avatar ? (
                      <img
                        src={comment.author.avatar}
                        alt={comment.author.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-800 flex items-center justify-center text-white font-semibold flex-shrink-0">
                        {comment.author.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-1">
                      <h5 className="font-semibold text-sm">
                        {comment.author.name}
                      </h5>
                      <span className="text-xs text-gray-500">
                        {dayjs(comment.createdAt).fromNow()}
                      </span>
                    </div>
                    <p className="text-gray-800 text-sm mb-2">
                      {comment.content}
                    </p>
                    <div className="flex items-center gap-4 text-gray-500">
                      <button className="flex items-center gap-1.5 hover:text-black transition-colors">
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium">100</span>
                      </button>
                      <button className="flex items-center gap-1.5 hover:text-black transition-colors">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium">reply</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-4">
                No comments yet. Be the first to comment!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
