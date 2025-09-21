"use client";

import { EUserRole } from "@/types/user";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { PREFIX_PATH } from "../layout";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const tabs = {
  manageEmployees: {
    key: "manageEmployees",
    label: "Manage Employees",
    role: EUserRole.MANAGER,
    link: PREFIX_PATH + "/employees",
  },
  manageTasks: {
    key: "manageTasks",
    label: "Manage Tasks",
    role: EUserRole.ANY,
    link: PREFIX_PATH + "/tasks",
  },

  conversations: {
    key: "conversations",
    label: "Messages",
    role: EUserRole.ANY,
    link: PREFIX_PATH + "/conversations",
  },
};

const Card = ({ label, link }: { label: string; link: string }) => {
  const pathname = usePathname();
  const isActive = pathname === link;
  return (
    <div
      className={cn(
        "flex flex-col gap-2 px-2",
        isActive && "border-r-4 border-r-primary bg-secondary"
      )}
    >
      <Link
        href={link}
        className={cn("text-primary", isActive && "text-primary")}
      >
        {label}
      </Link>
    </div>
  );
};

const SkeletonCard = () => {
  return <Skeleton className="w-full h-10 rounded-none" />;
};

const Sidebar = () => {
  const { data: session, status } = useSession();

  if (status === "loading")
    return (
      <div className="flex flex-col gap-2 w-full max-w-32">
        {Array.from({ length: 3 }).map((_, index) => (
          <SkeletonCard key={"skeleton_" + index} />
        ))}
      </div>
    );

  return (
    <div className="flex flex-col gap-2">
      {Object.values(tabs)
        .filter(
          (tab) =>
            tab.role === session?.user?.role || tab.role === EUserRole.ANY
        )
        .map((tab) => (
          <Card key={tab.key} label={tab.label} link={tab.link} />
        ))}
    </div>
  );
};

export default Sidebar;
