"use client";
import { Bell, ChevronDown, MessageSquare, Search, X } from "lucide-react";
import Brand from "./Brand";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import { Button } from "./ui/button";
import { useState } from "react";

const Navbar = () => {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <nav className="w-full bg-white shadow-md z-10">
      <div className="container mx-auto">
        <div className="flex items-center justify-between p-4 gap-2">
          {/* Logo */}
          <Brand />
          {/* End Logo */}

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-lg">
            <InputGroup className="w-full">
              <InputGroupInput placeholder="Search member or user..." />
              <InputGroupAddon>
                <Search />
              </InputGroupAddon>
            </InputGroup>
          </div>

          <div className="flex items-center gap-2">
            {/* Mobile Search */}
            <Button
              variant="outline"
              className="border-gray-400 md:hidden"
              onClick={() => setSearchOpen((prev) => !prev)}
            >
              {searchOpen ? <X /> : <Search />}
            </Button>

            {/* Message  */}
            <Button
              variant="outline"
              className="border-gray-400 hidden sm:inline-flex"
            >
              <MessageSquare />
            </Button>

            {/* Bell  */}
            <Button variant="outline" className="border-gray-400">
              <Bell />
            </Button>

            {/* Profile Dropdown */}
            <Button
              variant="outline"
              size="lg"
              className="hidden sm:inline-flex"
            >
              <div className="w-7 h-7 rounded-full bg-gray-500" />
              <ChevronDown />
            </Button>

            {/* Mobile avatar  */}
            <Button variant="outline" size="lg" className="sm:hidden px-2">
              <div className="w-7 h-7 rounded-full bg-gray-500" />
            </Button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {searchOpen && (
          <div className="md:hidden px-4 pb-4">
            <InputGroup className="w-full">
              <InputGroupInput
                placeholder="Search member or user..."
                autoFocus
              />
              <InputGroupAddon>
                <Search />
              </InputGroupAddon>
            </InputGroup>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
