import React from "react";
import Sidebar from "./_components/sidebar";

const Header = () => {
  return <div>Header</div>;
};

export const PREFIX_PATH = "/dashboard";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 gap-4">
        <Sidebar />
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
