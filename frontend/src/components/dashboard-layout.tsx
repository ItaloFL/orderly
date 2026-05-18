import { Outlet } from "react-router-dom";
import { Sidebar } from "./sidebar";

export function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-[#090d0b]">
      <Sidebar />
      <main className="flex-1 md:ml-64">
        <Outlet />
      </main>
    </div>
  );
}
