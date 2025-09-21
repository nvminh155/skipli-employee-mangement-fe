import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserIcon } from "lucide-react";

export function UserAvatar({ src }: { src: string | undefined }) {
  return (
    <Avatar>
      <AvatarImage src={src || ""} />
      <AvatarFallback>
        <UserIcon className="w-4 h-4" />
      </AvatarFallback>
    </Avatar>
  );
}
