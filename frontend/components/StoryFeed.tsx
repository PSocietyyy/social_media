import React from "react";
import { Plus } from "lucide-react";

export const StoryFeed = () => {
  const stories = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=2698&auto=format&fit=crop",
      authorName: "Sherlock Holmes",
      time: "24 mins ago",
      authorAvatar: "https://i.pravatar.cc/150?u=sh",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=2700&auto=format&fit=crop",
      authorName: "Paul McCartney",
      time: "1 hour ago",
      authorAvatar: "https://i.pravatar.cc/150?u=pm",
    },
  ];

  return (
    <div className="w-full py-4">
      <h2 className="text-lg font-semibold font-heading mb-3">Story</h2>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {/* Add Story Card */}
        <div className="min-w-32 h-48 rounded-xl relative overflow-hidden group cursor-pointer bg-slate-900 shrink-0">
          <img
            src="https://images.unsplash.com/photo-1517404215738-15263e9f9178?q=80&w=2670&auto=format&fit=crop"
            alt="Your Story"
            className="object-cover w-full h-full opacity-60 transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <span className="text-white text-sm font-medium">Your Story</span>
          </div>
        </div>

        {/* Other Stories */}
        {stories.map((story) => (
          <div
            key={story.id}
            className="min-w-32 h-48 rounded-xl relative overflow-hidden group cursor-pointer shrink-0"
          >
            <img
              src={story.image}
              alt={story.authorName}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

            <div className="absolute bottom-3 left-3 right-3">
              <div className="flex items-center gap-2 mb-1">
                <img
                  src={story.authorAvatar}
                  alt="Author"
                  className="w-6 h-6 rounded-full border-2 border-orange-500 object-cover"
                />
              </div>
              <p className="text-white text-sm font-semibold truncate leading-tight">
                {story.authorName}
              </p>
              <p className="text-gray-300 text-[10px]">{story.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
