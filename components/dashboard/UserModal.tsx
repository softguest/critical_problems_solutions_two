// components/UserModal.tsx
"use client";

import { useState } from "react";

interface UserModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  firstName: string;
}

const UserModal: React.FC<UserModalProps> = ({ showModal, setShowModal, firstName }) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 min-w-[300px] relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={() => setShowModal(false)}
          aria-label="Close modal"
        >
          &times;
        </button>
        <h2 className="text-lg font-semibold mb-2">User Profile</h2>
        <p className="text-gray-700 mb-4">Hello, {firstName}!</p>
        <nav className="flex flex-col gap-2">
          <a
            href="/dashboard/create-problem"
            className="block px-4 py-2 rounded hover:bg-blue-50 text-blue-700 font-medium transition-colors"
            onClick={() => setShowModal(false)}
          >
            Create Program
          </a>
          <a
            href="/dashboard/problem"
            className="block px-4 py-2 rounded hover:bg-blue-50 text-blue-700 font-medium transition-colors"
            onClick={() => setShowModal(false)}
          >
            All Problems
          </a>
          <a
            href="/dashboard/solution"
            className="block px-4 py-2 rounded hover:bg-blue-50 text-blue-700 font-medium transition-colors"
            onClick={() => setShowModal(false)}
          >
            All Solutions
          </a>
        </nav>
      </div>
    </div>
  );
};

export default UserModal;
