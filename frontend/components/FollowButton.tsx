"use client";

import { useState } from "react";
import { followUser, unfollowUser } from "@/lib/api";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface FollowButtonProps {
  userId: number;
  initialIsFollowing: boolean;
}

export function FollowButton({ userId, initialIsFollowing }: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleToggleFollow = async () => {
    const token = Cookies.get("access_token");
    if (!token) {
      toast.error("Please login to follow users");
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      if (isFollowing) {
        await unfollowUser(token, userId);
        setIsFollowing(false);
        toast.success("Unfollowed successfully");
      } else {
        await followUser(token, userId);
        setIsFollowing(true);
        toast.success("Followed successfully");
      }
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to toggle follow");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleFollow}
      disabled={loading}
      className={`px-6 py-2 rounded-lg font-semibold text-sm transition-colors ${
        isFollowing
          ? "bg-gray-200 text-black hover:bg-gray-300"
          : "bg-orange-500 text-white hover:bg-orange-600"
      }`}
    >
      {loading ? "Loading..." : isFollowing ? "Following" : "Follow"}
    </button>
  );
}
