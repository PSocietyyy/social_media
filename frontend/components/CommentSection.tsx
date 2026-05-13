"use client";

import { useState } from "react";
import { MessageSquare, ThumbsUp, MoreHorizontal, Edit2, Trash2 } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { createComment, deleteComment, updateComment } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

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

interface CommentSectionProps {
  postId: number;
  initialComments: Comment[];
  commentCount: number;
  currentUser: any | null;
}

export function CommentSection({
  postId,
  initialComments,
  commentCount,
  currentUser,
}: CommentSectionProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const router = useRouter();

  const handleCreateComment = async () => {
    if (!content.trim()) return;
    const token = Cookies.get("access_token");
    if (!token) {
      toast.error("Please login to comment");
      return;
    }

    setIsSubmitting(true);
    try {
      await createComment(token, postId, content);
      setContent("");
      toast.success("Comment posted");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to post comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;
    const token = Cookies.get("access_token");
    if (!token) return;

    try {
      await deleteComment(token, commentId);
      toast.success("Comment deleted");
      setOpenMenuId(null);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete comment");
    }
  };

  const handleUpdateComment = async (commentId: number) => {
    if (!editContent.trim()) return;
    const token = Cookies.get("access_token");
    if (!token) return;

    try {
      await updateComment(token, commentId, editContent);
      toast.success("Comment updated");
      setEditingId(null);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to update comment");
    }
  };

  return (
    <div className="bg-white rounded-xl border shadow-sm p-4 mt-4">
      <h4 className="font-semibold text-lg mb-4">
        Comments <span className="text-gray-500 font-normal">{commentCount}</span>
      </h4>

      {/* Comment Input */}
      <div className="flex gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0">
          {currentUser?.avatar ? (
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-full h-full object-cover"
            />
          ) : currentUser ? (
            <div className="w-full h-full bg-slate-800 flex items-center justify-center text-white font-semibold">
              {currentUser.name.charAt(0)}
            </div>
          ) : (
            <img
              src={`https://ui-avatars.com/api/?name=Guest&background=random`}
              alt="Guest"
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <div className="flex flex-col w-full flex-1 gap-2">
          <input
            type="text"
            placeholder={currentUser ? "Write a comment..." : "Login to comment..."}
            disabled={!currentUser || isSubmitting}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreateComment();
            }}
            className="w-full border-b border-gray-300 px-1 py-2 text-sm focus:outline-none focus:border-orange-500 transition-colors disabled:bg-gray-50"
          />
          <div className="flex justify-end">
            <button
              onClick={handleCreateComment}
              disabled={!currentUser || !content.trim() || isSubmitting}
              className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
            >
              {isSubmitting ? "Posting..." : "Post Comment"}
            </button>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="flex flex-col gap-6">
        {initialComments && initialComments.length > 0 ? (
          initialComments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <Link href={`/user/${comment.author.id}`} className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0">
                {comment.author.avatar ? (
                  <img
                    src={comment.author.avatar}
                    alt={comment.author.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-800 flex items-center justify-center text-white font-semibold shrink-0">
                    {comment.author.name.charAt(0)}
                  </div>
                )}
              </Link>
              <div className="flex flex-col flex-1">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Link href={`/user/${comment.author.id}`} className="font-semibold text-sm hover:underline">
                      {comment.author.name}
                    </Link>
                    <span className="text-xs text-gray-500">
                      {dayjs(comment.createdAt).fromNow()}
                    </span>
                  </div>
                  
                  {currentUser?.id === comment.authorId && (
                    <div className="relative">
                      <button
                        onClick={() => setOpenMenuId(openMenuId === comment.id ? null : comment.id)}
                        className="text-gray-500 hover:bg-gray-100 p-1 rounded-full transition-colors"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      {openMenuId === comment.id && (
                        <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 shadow-md rounded-md w-32 z-10 py-1">
                          <button
                            onClick={() => {
                              setEditingId(comment.id);
                              setEditContent(comment.content);
                              setOpenMenuId(null);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                          >
                            <Edit2 className="w-3.5 h-3.5" /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {editingId === comment.id ? (
                  <div className="flex flex-col gap-2 mt-1">
                    <input
                      type="text"
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-orange-500"
                      autoFocus
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-xs font-medium text-gray-500 hover:text-black"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleUpdateComment(comment.id)}
                        className="text-xs font-medium text-orange-600 hover:text-orange-700"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-800 text-sm mb-2">{comment.content}</p>
                )}

                <div className="flex items-center gap-4 text-gray-500">
                  <button className="flex items-center gap-1.5 hover:text-black transition-colors">
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span className="text-xs font-medium">Like</span>
                  </button>
                  <button className="flex items-center gap-1.5 hover:text-black transition-colors">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span className="text-xs font-medium">Reply</span>
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
  );
}
