import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const RightSidebarPublic = () => {
  return (
    <aside className="w-full h-full max-w-72 hidden lg:flex flex-col gap-4 p-4 sticky top-0">
      <Card className="border-none shadow-sm rounded-xl overflow-hidden">
        <CardHeader className="bg-white pb-2 pt-4 px-4 border-b">
          <CardTitle className="text-sm font-semibold text-gray-800">
            Recommendation
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 bg-white">
          <div className="flex flex-col">
            <div className="p-4 hover:bg-gray-50 border-b cursor-pointer transition-colors">
              <h3 className="font-semibold text-gray-900 text-sm">
                # Hello World
              </h3>
              <p className="text-xs text-gray-500">250 posts</p>
            </div>
            <div className="p-4 hover:bg-gray-50 border-b cursor-pointer transition-colors">
              <h3 className="font-semibold text-gray-900 text-sm">
                # Indonesia
              </h3>
              <p className="text-xs text-gray-500">150 posts</p>
            </div>
            <div className="p-4 hover:bg-gray-50 cursor-pointer transition-colors">
              <h3 className="font-semibold text-gray-900 text-sm">
                # Programming
              </h3>
              <p className="text-xs text-gray-500">100 posts</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-xs text-gray-400 mt-2 px-2">
        <p>© 2026 Social Media App</p>
        <p className="mt-1">Terms · Privacy · Policy</p>
      </div>
    </aside>
  );
};

export default RightSidebarPublic;
