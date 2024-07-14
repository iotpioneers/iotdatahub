"use client";
import { useSession } from "next-auth/react";
import { Avatar } from "@radix-ui/react-avatar";
import UploadImage from "./UploadImage";
import { Container } from "@radix-ui/themes";

const UserProfile = () => {
  const { status, data: session } = useSession();

  return (
    <div>
      <div className="flex items-center justify-between">
        {status === "authenticated" && (
          <div>
            <Avatar className="h-36 w-36 bg-gray-500 rounded-full flex items-center justify-center">
              {session!.user!.image ? (
                <img
                  src={session!.user!.image}
                  alt="Profile"
                  className="rounded-full"
                />
              ) : (
                session!.user!.name!.split("")[0].toUpperCase()
              )}
            </Avatar>
            <div className="absolute -mt-8 ml-11">
              <UploadImage />
            </div>
          </div>
        )}
        <Container className="h-36 w-96 ml-5 rounded-md">
          <div className="grid gap-2">
            <div>
              <label
                htmlFor="name"
                className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
              >
                Names
              </label>
              <input
                type="text"
                name="name"
                id="name"
                className="bg-white border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={session?.user?.name!}
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
              >
                Email
              </label>
              <input
                type="text"
                name="name"
                id="name"
                className="bg-white border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={session?.user?.email!}
              />
            </div>
          </div>
        </Container>
      </div>
      <button
        type="submit"
        className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mt-4"
      >
        Update Profile
      </button>
    </div>
  );
};

export default UserProfile;
