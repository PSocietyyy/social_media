import React from "react";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Image } from "lucide-react";
import { Button } from "./ui/button";

const PostFormPublic = ({ user }: { user?: any }) => {
  return (
    <div className="w-full p-2 rounded-md bg-white shadow-md border border-gray-200">
      <div className="w-full flex items-center">
        <div className="w-14 h-14 rounded-full bg-gray-500 overflow-hidden shrink-0 flex items-center justify-center">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          ) : user ? (
            <span className="text-white text-lg font-semibold">
              {user.name.charAt(0)}
            </span>
          ) : null}
        </div>
        <div className="w-full flex flex-col gap-2 p-2">
          <Textarea placeholder="How are you today" />
          <div className="w-full flex items-center justify-between">
            <Input type="file" id="upload" className="hidden" />
            <label
              htmlFor="upload"
              className="px-2 py-1 flex items-center gap-1 rounded-md hover:bg-gray-200 border border-gray-300"
            >
              <Image className="w-5 h-5" />
              <span>Image/Video</span>
            </label>
            <Button>Post</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostFormPublic;
