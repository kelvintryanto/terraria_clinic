"use client";

import { History, LayoutDashboard, List, LogOut, User } from "lucide-react";
import Link from "next/link";

interface User {
  id: string;
  name: string;
  email: string;
}

const ProfileCard = () => {
  return (
    <>
      <div className="flex flex-col justify-between rounded-md bg-violet-800 p-2 sm:p-4 shadow-lg min-h-screen sm:w-[250px]">
        <div className="space-y-3">
          <div className="flex justify-center sm:justify-normal items-center gap-1 hover:bg-white/20 py-1 px-2 rounded-md hover:text-orange-500 hover:cursor-pointer text-white">
            <LayoutDashboard size={20} />
            <h1 className="hidden sm:block">Overview</h1>
          </div>
          <div className="flex justify-center sm:justify-normal items-center gap-1 hover:bg-white/20 py-1 px-2 rounded-md hover:text-orange-500 hover:cursor-pointer text-white">
            <User size={20} />
            <h1 className="hidden sm:block">Profile</h1>
          </div>
          <div className="flex justify-center sm:justify-normal items-center gap-1 hover:bg-white/20 py-1 px-2 rounded-md hover:text-orange-500 hover:cursor-pointer text-white">
            <History size={20} />
            <h1 className="hidden sm:block">History</h1>
          </div>
          <div className="flex justify-center sm:justify-normal items-center gap-1 hover:bg-white/20 py-1 px-2 rounded-md hover:text-orange-500 hover:cursor-pointer text-white">
            <List size={20} />
            <h1 className="hidden sm:block">Pet List</h1>
          </div>
        </div>

        <div className="w-full flex">
          <Link href="/logout" className="text-white bg-red-500 rounded-md px-4 py-2 w-full hover:bg-red-600 hover:text-white flex gap-1">
            <LogOut size={20} />
            <h1 className="hidden sm:block">Logout</h1>
          </Link>
        </div>
      </div>
    </>
  );
};

export default ProfileCard;
