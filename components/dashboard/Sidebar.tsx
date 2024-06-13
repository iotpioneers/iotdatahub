"use client";

import Link from "next/link";
import React from "react";

const DashboardSidebar = () => {
  return (
    <div className="h-full">
      <h2 className="text-lg font-semibold mb-4">Dashboard</h2>
      <ul>
        <li className={`py-2 px-4 `}>
          <Link href="/">Dashboard</Link>
        </li>
        <li className={`py-2 px-4 `}>
          <Link href="/devices">Devices</Link>
        </li>
        <li className={`py-2 px-4`}>
          <Link href="/channels">Channels</Link>
        </li>
        <li className={`py-2 px-4`}>
          <Link href="/data">Data</Link>
        </li>
        <li className={`py-2 px-4 `}>
          <Link href="/analytics">Analytics</Link>
        </li>
        <li className={`py-2 px-4 `}>
          <Link href="/settings">Settings</Link>
        </li>
        <li className={`py-2 px-4`}>
          <Link href="/help">Help & Support</Link>
        </li>
        <li className={`py-2 px-4 `}>
          <Link href="/about">About</Link>
        </li>
      </ul>
    </div>
  );
};

export default DashboardSidebar;
