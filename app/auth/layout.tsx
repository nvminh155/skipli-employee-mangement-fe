import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  console.log("Layout")
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="w-full max-h-[400px] max-w-[400px] ">{children}</div>
    </div>
  );
};

export default Layout;
