"use client";

import { useState } from "react";
import { FollowListModal } from "./FollowListModal";

interface ProfileStatsProps {
  userId: number;
  postsCount: number;
  followersCount: number;
  followingCount: number;
}

export function ProfileStats({ userId, postsCount, followersCount, followingCount }: ProfileStatsProps) {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: "followers" | "following";
  }>({
    isOpen: false,
    type: "followers",
  });

  return (
    <>
      <div className="flex gap-6 mb-4">
        <div className="flex gap-1">
          <span className="font-semibold">{postsCount}</span>
          <span className="text-gray-900">posts</span>
        </div>
        <button
          onClick={() => setModalState({ isOpen: true, type: "followers" })}
          className="flex gap-1 hover:opacity-70 transition-opacity"
        >
          <span className="font-semibold">{followersCount}</span>
          <span className="text-gray-900">followers</span>
        </button>
        <button
          onClick={() => setModalState({ isOpen: true, type: "following" })}
          className="flex gap-1 hover:opacity-70 transition-opacity"
        >
          <span className="font-semibold">{followingCount}</span>
          <span className="text-gray-900">following</span>
        </button>
      </div>

      <FollowListModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ ...modalState, isOpen: false })}
        userId={userId}
        type={modalState.type}
      />
    </>
  );
}
