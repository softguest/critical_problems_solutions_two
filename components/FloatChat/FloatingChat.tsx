"use client";

import { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";
import ChatComponent from "../chatBox/ChatComponent";

export default function FloatingChat() {
  const [open, setOpen] = useState(false); // controls visibility
  const [animate, setAnimate] = useState(false); // controls slide animation

  // Handle mounting/unmounting with animation
  useEffect(() => {
    if (open) {
      setAnimate(true); // slide in
    } else {
      const timer = setTimeout(() => setAnimate(false), 300); // wait for slide-out
      return () => clearTimeout(timer);
    }
  }, [open]);

  return (
    <div className="">
      {/* Floating Chat Icon */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg p-4 transition-all flex items-center justify-center"
        aria-label="Open AI Chat"
      >
        <MessageCircle className="w-7 h-7" />
      </button>

      {/* Sidebar with animation */}
      {animate && (
        <>
          <div
            className={`fixed inset-y-0 right-0 z-50 transform transition-transform duration-300 ease-in-out 
            ${open ? "translate-x-0" : "translate-x-full"} 
            w-full md:w-1/2 bg-white dark:bg-zinc-900 shadow-2xl`}
          >
            {/* Header with Close Button */}
            <div className="flex items-center justify-between p-4 border-b dark:border-zinc-800">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                AI Chat
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="h-[calc(100vh-64px)] overflow-y-auto p-4">
              <ChatComponent />
            </div>
          </div>

          {/* Overlay (click to close) */}
          <div
            onClick={() => setOpen(false)}
            className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${
              open ? "opacity-100" : "opacity-0"
            }`}
          />
        </>
      )}
    </div>
  );
}
