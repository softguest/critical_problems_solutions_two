"use client";

import { useState } from "react";
import UserModal from "../UserModal";
import { useCurrentUser } from "@/hooks/use-current-user";
import UserCircleButton from "../UserCircleButton";
import { Settings } from "lucide-react";

const UserModalHouse = () => {
  const [showModal, setShowModal] = useState(false);
  const session = useCurrentUser();
  
  return (
    <div className="p-2">
      {/* Trigger button */}
      <Settings onClick={() => setShowModal(true)} className="cursor-pointer"/>

      {/* Modal */}
      <UserModal
        showModal={showModal}
        setShowModal={setShowModal}
        firstName={session?.firstName || "User"}
      />
    </div>
  );
};

export default UserModalHouse;
