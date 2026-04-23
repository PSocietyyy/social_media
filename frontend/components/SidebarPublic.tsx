"use client";
import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Home, Settings, Store } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";

const SidebarPublic = ({ user }: { user: any }) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    router.push("/login");
  };

  const links = [
    {
      href: "/",
      label: "Home",
      icon: Home,
    },
    {
      href: "/settings",
      label: "Settings",
      icon: Settings,
    },
    {
      href: "/marketplace",
      label: "Marketplace",
      icon: Store,
    },
  ];
  return (
    <aside className="max-w-96 w-full bg-white h-full p-4">
      {/* Profile */}
      <div className="w-full p-2 space-y-4">
        {user ? (
          <>
            <div className="flex items-center gap-2">
              <div className="w-14 h-14 rounded-full bg-gray-400 overflow-hidden shrink-0">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-800 flex items-center justify-center text-white font-semibold text-lg">
                    {user.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-semibold">{user.name}</span>
                <span className="text-sm text-gray-500">@{user.username}</span>
              </div>
            </div>
            <div className="flex items-center justify-center w-full gap-4">
              <div className="flex flex-col items-center justify-center">
                <h1 className="font-heading text-lg font-semibold">Posts</h1>
                <span>10</span>
              </div>
              <div className="flex flex-col items-center justify-center">
                <h1 className="font-heading text-lg font-semibold">
                  Following
                </h1>
                <span>200</span>
              </div>
              <div className="flex flex-col items-center justify-center">
                <h1 className="font-heading text-lg font-semibold">
                  Followers
                </h1>
                <span>300</span>
              </div>
            </div>
            <Button className="w-full" onClick={() => router.push("/profile")}>
              See Profile
            </Button>
          </>
        ) : (
          <div className="flex flex-col gap-2">
            <span className="text-sm text-gray-500 text-center">
              Not logged in
            </span>
            <Button className="w-full" onClick={() => router.push("/login")}>
              Login
            </Button>
          </div>
        )}
      </div>
      {/* End Profile */}
      {/* Link */}
      <div className="w-full flex flex-col gap-2 p-2">
        {links.map((link, index) => (
          <Link
            key={index}
            href={link.href}
            className={`w-full px-3 py-2 rounded-l-md group hover:border-r-2 hover:border-orange-500 ${
              pathname === link.href && "border-r-2 border-orange-500"
            }`}
          >
            <div className="flex items-center gap-2">
              <link.icon
                className={`group-hover:text-orange-600 ${
                  pathname === link.href && "text-orange-600"
                }`}
              />{" "}
              <span
                className={`font-heading group-hover:text-orange-600 ${
                  pathname === link.href && "text-orange-600"
                }`}
              >
                {link.label}
              </span>
            </div>
          </Link>
        ))}
      </div>
      {/* End Link */}

      {/* Bottom Sidebar */}
      {user && (
        <div className="w-full flex flex-col gap-2 p-2 mt-auto">
          <Button
            variant="destructive"
            size={"lg"}
            onClick={handleLogout}
            className="w-full text-white font-medium bg-red-500 hover:bg-red-600"
          >
            Logout
          </Button>
        </div>
      )}
      {/* End Bottom Sidebar */}
    </aside>
  );
};

export default SidebarPublic;
