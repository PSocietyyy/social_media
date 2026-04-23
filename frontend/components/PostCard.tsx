"use client";
import React, { useState } from "react";
import {
  MoreHorizontal,
  MessageSquare,
  ThumbsUp,
  Trash2,
  Edit2,
} from "lucide-react";
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { deletePost } from "@/lib/api";
import { useRouter } from "next/navigation";

dayjs.extend(relativeTime);

export interface Post {
  id: number;
  content: string;
  authorId: number;
  author: {
    id: number;
    name: string;
    username: string;
    avatar: string | null;
  };
  media: {
    id: number;
    url: string;
    type: "IMAGE" | "VIDEO";
    postId: number;
    createdAt: string;
  }[];
  hashtags: {
    id: number;
    postId: number;
    hashtagId: number;
    hashtag: {
      id: number;
      name: string;
    };
  }[];
  _count: {
    likes: number;
    comments: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface PostCardProps {
  post: Post;
  isDetail?: boolean;
  currentUser?: any;
}

export const PostCard = ({
  post,
  isDetail = false,
  currentUser,
}: PostCardProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const isOwner = currentUser && currentUser.id === post.authorId;

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    const token = Cookies.get("access_token");
    if (!token) return;

    try {
      await deletePost(token, post.id);
      toast.success("Post deleted successfully");
      setMenuOpen(false);
      router.refresh(); // Refresh feed
      if (isDetail) {
        router.push("/");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to delete post");
    }
  };

  return (
    <div
      className={`w-full bg-white ${isDetail ? "rounded-xl border shadow-sm p-4" : "rounded-xl border shadow-sm p-4"} mb-4`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3 relative">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0">
            {post.author.avatar ? (
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-slate-800 flex items-center justify-center text-white font-semibold">
                {post.author.name.charAt(0)}
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <h3 className="font-semibold text-[15px]">{post.author.name}</h3>
            <span className="text-xs text-gray-500">
              {dayjs(post.createdAt).fromNow()}
            </span>
          </div>
        </div>

        {isOwner && (
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-500 hover:bg-gray-100 p-2 rounded-full transition-colors"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
            {menuOpen && (
              <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 shadow-md rounded-md w-36 z-10 py-1">
                <button
                  onClick={() => router.push(`/post/${post.id}/edit`)}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  <Edit2 className="w-4 h-4" /> Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <Link href={isDetail ? "#" : `/post/${post.id}`}>
        <div className="mb-3">
          {post.content && (
            <p className="text-gray-800 whitespace-pre-wrap text-[15px] leading-relaxed mb-2">
              {post.content}
            </p>
          )}

          {post.hashtags && post.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {post.hashtags.map((h) => (
                <span
                  key={h.id}
                  className="text-blue-600 hover:underline cursor-pointer text-sm"
                >
                  #{h.hashtag.name}
                </span>
              ))}
            </div>
          )}

          {post.media && post.media.length > 0 && (
            <div
              className={`grid gap-2 ${post.media.length === 1 ? "grid-cols-1" : post.media.length === 2 ? "grid-cols-2" : post.media.length >= 3 ? "grid-cols-2" : ""} rounded-xl overflow-hidden mt-2`}
            >
              {post.media.slice(0, 4).map((m, idx) => (
                <div
                  key={m.id}
                  className={`relative block bg-gray-100 ${post.media.length === 3 && idx === 0 ? "col-span-2" : ""}`}
                >
                  <img
                    src={m.url}
                    alt="Post media"
                    className="object-cover w-full h-full max-h-[400px]"
                  />
                  {post.media.length > 4 && idx === 3 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white font-semibold text-xl">
                        +{post.media.length - 4} More
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </Link>

      {/* Actions */}
      <div className="flex items-center gap-4 mt-4 text-gray-600">
        <button className="flex items-center gap-2 hover:bg-gray-50 px-3 py-1.5 rounded-lg transition-colors border">
          <ThumbsUp className="w-4 h-4" />
          <span className="text-sm font-medium">
            {post._count?.likes || 0} Likes
          </span>
        </button>
        <button className="flex items-center gap-2 hover:bg-gray-50 px-3 py-1.5 rounded-lg transition-colors border">
          <MessageSquare className="w-4 h-4" />
          <span className="text-sm font-medium">
            {post._count?.comments || 0} Comment
          </span>
        </button>
      </div>
    </div>
  );
};
