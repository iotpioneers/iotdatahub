import React from "react";
import UserProfile from "@/components/Settings/UserProfile";

const SettingsPage = () => {
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="w-full lg:w-3/5 bg-slate-100 justify-center items-center p-5">
        <h1 className="text-3xl text-n-8 font-bold justify-center items-center mb-10">
          Settings
        </h1>
        <UserProfile />
      </div>
    </section>
  );
};

export default SettingsPage;
