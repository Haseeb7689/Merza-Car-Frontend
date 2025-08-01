"use client";

import { useState } from "react";
import Header from "./Header";
import SideMenu from "./SideMenu";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div>
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow">
        <Header onToggleSidebar={toggleSidebar} />
      </div>

      {/* Sidebar overlay for mobile */}
      <div
        className={`fixed inset-0 z-30 bg-black/40 md:hidden transition-opacity ${
          sidebarOpen ? "block" : "hidden"
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar on the right */}
      <aside
        className={`flex fixed top-25 right-0 h-full bg-white border-l z-40 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        } md:translate-x-0 md:block md:w-30`}
      >
        <SideMenu />
      </aside>

      {/* Main content (pushed left to make space for right sidebar on md+) */}
      <main className="pt-25 md:mr-16">{children}</main>
    </div>
  );
}
