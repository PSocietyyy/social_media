"use client";
import React, { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { updatePost } from "@/lib/api";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function EditPostPage() {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    // Fetch post to populate the form
    const fetchPost = async () => {
      try {
        const res = await fetch(`http://localhost:3001/posts/${params.id}`);
        if (!res.ok) throw new Error("Failed to fetch post");
        const result = await res.json();
        if (result.data) {
          setContent(result.data.content || "");
        }
      } catch (err) {
        toast.error("Failed to load post data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPost();
  }, [params.id]);

  const handleUpdate = async () => {
    if (!content.trim()) {
      toast.error("Post content cannot be empty.");
      return;
    }

    const token = Cookies.get("access_token");
    if (!token) {
      toast.error("Please login first");
      router.push("/login");
      return;
    }

    setIsSubmitting(true);
    try {
      await updatePost(token, Number(params.id), { content });
      toast.success("Post updated successfully!");
      router.push(`/post/${params.id}`);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to update post");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="flex-1 flex justify-center py-6 h-full w-full bg-gray-50">
      <div className="w-full max-w-2xl px-4">
        {/* Back Button */}
        <Link
          href={`/post/${params.id}`}
          className="inline-flex items-center gap-2 text-gray-700 hover:text-black hover:bg-gray-200 px-3 py-2 rounded-lg transition-colors font-medium mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Cancel</span>
        </Link>
        <div className="w-full p-6 rounded-md bg-white shadow-sm border border-gray-200">
          <h1 className="text-xl font-bold mb-4">Edit Post</h1>
          <Textarea
            placeholder="Edit your content here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isSubmitting}
            className="border-gray-300 resize-none w-full"
            rows={5}
          />
          <div className="w-full flex items-center justify-end mt-4">
            <Button
              onClick={handleUpdate}
              disabled={isSubmitting || !content.trim()}
            >
              {isSubmitting ? "Updating..." : "Update Post"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
