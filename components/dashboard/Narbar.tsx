
import Link from "next/link";
import SignOut from "./SignOut";
import SearchBar from "./SearchBar";
import UserCircleButton from "./UserCircleButton"; 

import UserModalHouse from "./navhouse/UserModalHouse";
import UserNameDisplay from "./navhouse/UserNameDisplay";

export default function Navbar() {

  return (
    <header className="sticky top-0 z-20 w-full bg-white shadow-sm px-4 py-2 flex items-center justify-between md:pl-4">
      <div className="flex items-center space-x-2">
        <Link href="/dashboard">
          <h1 className="text-1xl md:text-3xl md:mr-10 font-semibold">CP<span className="text-blue-700 font-bold">S</span></h1>
        </Link>
        <div className="hidden md:block">
          <SearchBar />
        </div>
      </div>
      <div className="flex items-center">
        <span className="text-[12px] md:text-sm text-gray-600 md:ml-16">
          <UserNameDisplay />
        </span>
        <div className="flex justify-center items-center">
          <UserModalHouse />
          <SignOut />
        </div>
      </div>
    </header>
  );
}
