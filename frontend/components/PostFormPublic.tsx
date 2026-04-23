"use client";
import React, { useState } from "react";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Image as ImageIcon } from "lucide-react";
import { Button } from "./ui/button";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { createPost } from "@/lib/api";
import { useRouter } from "next/navigation";

const PostFormPublic = ({ user }: { user?: any }) => {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handlePost = async () => {
    if (!content.trim()) {
      toast.error("Post content cannot be empty.");
      return;
    }

    const token = Cookies.get("access_token");
    if (!token) {
      toast.error("Please login to create a post");
      router.push("/login");
      return;
    }

    setIsSubmitting(true);
    try {
      await createPost(token, { content });
      setContent("");
      toast.success("Post created successfully!");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to create post");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full p-4 rounded-md bg-white shadow-sm border border-gray-200">
      <div className="w-full flex">
        <div className="w-10 h-10 rounded-full bg-gray-500 overflow-hidden shrink-0 flex items-center justify-center mr-3">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          ) : user ? (
            <span className="text-white text-md font-semibold">
              {user.name.charAt(0)}
            </span>
          ) : null}
        </div>
        <div className="flex-1 flex flex-col gap-3">
          <Textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isSubmitting}
            className="border-gray-200 resize-none"
            rows={3}
          />
          <div className="w-full flex items-center justify-between">
            <div>
              <Input type="file" id="upload" className="hidden" />
              <label
                htmlFor="upload"
                className="px-3 py-1.5 flex items-center gap-2 rounded-md hover:bg-gray-100 text-sm font-medium text-gray-700 cursor-pointer"
              >
                <ImageIcon className="w-4 h-4 text-green-600" />
                <span>Photo/Video</span>
              </label>
            </div>
            <Button
              onClick={handlePost}
              disabled={isSubmitting || !content.trim()}
            >
              {isSubmitting ? "Posting..." : "Post"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostFormPublic;
