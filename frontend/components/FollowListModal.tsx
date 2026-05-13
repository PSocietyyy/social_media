"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import Cookies from "js-cookie";
import Link from "next/link";
import { getFollowers, getFollowing } from "@/lib/api";

interface FollowListModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
  type: "followers" | "following";
}

export function FollowListModal({ isOpen, onClose, userId, type }: FollowListModalProps) {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      const token = Cookies.get("access_token");
      
      try {
        let res;
        if (type === "followers") {
          res = await getFollowers(token || "", userId);
          setUsers(res.data.map((item: any) => item.follower));
        } else {
          res = await getFollowing(token || "", userId);
          setUsers(res.data.map((item: any) => item.following));
        }
      } catch (err: any) {
        setError(err.message || "Failed to load list");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [isOpen, userId, type]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col max-h-[80vh]">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold text-lg capitalize">{type}</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <div className="overflow-y-auto p-4 flex flex-col gap-4">
          {loading ? (
            <div className="text-center text-gray-500 py-8">Loading...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">{error}</div>
          ) : users.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No {type} yet.
            </div>
          ) : (
            users.map((user) => (
              <div key={user.id} className="flex items-center justify-between">
                <Link href={`/user/${user.id}`} onClick={onClose} className="flex items-center gap-3 flex-1 hover:bg-gray-50 p-2 rounded-lg transition-colors">
                  <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-slate-800 flex items-center justify-center text-white font-semibold">
                        {user.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm">{user.username}</span>
                    <span className="text-xs text-gray-500">{user.name}</span>
                  </div>
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
