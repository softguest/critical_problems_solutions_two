    // components/UserCircleButton.tsx
"use client";

import { UserCircle } from "lucide-react";

interface UserCircleButtonProps {
  onClick: () => void;
}

const UserCircleButton: React.FC<UserCircleButtonProps> = ({ onClick }) => (
  <button
    type="button"
    aria-label="Open user modal"
    onClick={onClick}
    className="focus:outline-none"
  >
    <UserCircle size={30} />
  </button>
);

export default UserCircleButton;
