"use client";

import { useAuth } from "@/hooks/use-auth";
import { LogOut,  ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
export default function Header() {
  const { user, logoutController, isLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card/80 backdrop-blur-md px-6">
      <div className="flex items-center">
        <span className="text-2xl font-semibold text-gray-900 tracking-tight mr-8">
          ticktock
        </span>
        <span className="text-sm font-medium">TimeSheets</span>
      </div>
      <div className="relative" ref={dropdownRef}>
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-2 px-2 py-1 cursor-pointer rounded-md hover:bg-gray-100"
        >
          {user && (
            <span className="text-[1rem] text-gray-500 font-medium capitalize">
              {user.name}
            </span>
          )}
          <ChevronDown size={16} className={`text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </div>
        {isOpen && (
          <div className="absolute right-0 mt-2 w-[8rem] rounded-lg border border-border bg-white shadow-lg animate-in fade-in zoom-in-95">
            <button
              onClick={logoutController}
              disabled={isLoading}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-red-50 hover:text-red-600"
            >
              <LogOut size={16} />
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
