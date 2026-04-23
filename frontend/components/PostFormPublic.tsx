"use client";
import React, { useState } from "react";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Image as ImageIcon, X } from "lucide-react";
import { Button } from "./ui/button";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { createPost } from "@/lib/api";
import { useRouter } from "next/navigation";

const PostFormPublic = ({ user }: { user?: any }) => {
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      const newFiles = [...files, ...selectedFiles];
      setFiles(newFiles);

      // Generate preview URLs
      const newPreviewUrls = selectedFiles.map((file) =>
        URL.createObjectURL(file),
      );
      setPreviewUrls([...previewUrls, ...newPreviewUrls]);
    }
  };

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    const updatedPreviews = previewUrls.filter((_, i) => i !== index);
    // Cleanup generated object URL memory
    URL.revokeObjectURL(previewUrls[index]);

    setFiles(updatedFiles);
    setPreviewUrls(updatedPreviews);
  };

  const extractHashtags = (text: string) => {
    const regex = /#[\w]+/g;
    const matches = text.match(regex);
    return matches ? matches.map((m) => m.slice(1).toLowerCase()) : [];
  };

  const handlePost = async () => {
    if (!content.trim() && files.length === 0) {
      toast.error("Format post: Add content or an image.");
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
      // Encode files to Base64 to bypass missing backend file upload endpoints
      const media = await Promise.all(
        files.map((file) => {
          return new Promise<{ url: string; type: string }>(
            (resolve, reject) => {
              const reader = new FileReader();
              reader.readAsDataURL(file);
              reader.onload = () =>
                resolve({
                  url: reader.result as string,
                  type: file.type.startsWith("video") ? "VIDEO" : "IMAGE",
                });
              reader.onerror = (error) => reject(error);
            },
          );
        }),
      );

      const hashtags = extractHashtags(content);

      await createPost(token, { content, media, hashtags });

      // Clear form
      setContent("");
      setFiles([]);
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
      setPreviewUrls([]);

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
            placeholder="What's on your mind? Add some #hashtags..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isSubmitting}
            className="border-gray-200 resize-none"
            rows={3}
          />

          {/* Image Previews */}
          {previewUrls.length > 0 && (
            <div
              className={`grid gap-2 mt-2 ${previewUrls.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}
            >
              {previewUrls.map((url, index) => (
                <div
                  key={index}
                  className="relative rounded-lg overflow-hidden border border-gray-200 aspect-video bg-gray-100"
                >
                  <img
                    src={url}
                    alt={`preview-${index}`}
                    className="object-cover w-full h-full"
                  />
                  <button
                    onClick={() => removeFile(index)}
                    className="absolute top-1 right-1 bg-black/60 hover:bg-black text-white p-1 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="w-full flex items-center justify-between">
            <div>
              <Input
                type="file"
                id="upload"
                className="hidden"
                multiple
                accept="image/*,video/*"
                onChange={handleFileChange}
              />
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
              disabled={isSubmitting || (!content.trim() && files.length === 0)}
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
