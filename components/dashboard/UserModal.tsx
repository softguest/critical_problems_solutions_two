"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

interface UserModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  firstName: string;
}

const UserModal: React.FC<UserModalProps> = ({ showModal, setShowModal, firstName }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (showModal) {
      setIsMounted(true);
    } else {
      const timer = setTimeout(() => setIsMounted(false), 200); // match transition duration
      return () => clearTimeout(timer);
    }
  }, [showModal]);

  if (!isMounted) return null;

  return (
    <div
      className={`fixed inset-0 z-0 flex items-center justify-center transition-all duration-200 ${
        showModal ? "bg-black/50" : "bg-transparent pointer-events-none"
      }`}
    >
      <div
        className={`relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-2xl p-6 min-w-[300px] max-w-sm w-full transform transition-all duration-300 ${
          showModal ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-4"
        }`}
      >
        {/* Close button */}
        <button
          className="absolute top-3 right-3 text-zinc-500 hover:text-zinc-800 dark:hover:text-white transition"
          onClick={() => setShowModal(false)}
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* Title */}
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">User Profile</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-300 mb-4">Hello, {firstName}!</p>

        {/* Nav Links */}
        <nav className="flex flex-col gap-2">
          <a
            href="/dashboard/create-problem"
            onClick={() => setShowModal(false)}
            className="block px-4 py-2 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-zinc-800 transition-colors font-medium"
          >
            ➕ Create Problem
          </a>
          <a
            href="/dashboard/problem"
            onClick={() => setShowModal(false)}
            className="block px-4 py-2 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-zinc-800 transition-colors font-medium"
          >
            📄 All Problems
          </a>
          <a
            href="/dashboard/solution"
            onClick={() => setShowModal(false)}
            className="block px-4 py-2 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-zinc-800 transition-colors font-medium"
          >
            💡 All Solutions
          </a>
        </nav>
      </div>
    </div>
  );
};

export default UserModal;
