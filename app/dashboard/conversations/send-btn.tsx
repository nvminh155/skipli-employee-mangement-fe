"use client";

import { useConversationStore } from "@/stores/conversation.store";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";


const SendMessageBtn = () => {
  const [message, setMessage] = useState("");
  const { sendMessage } = useConversationStore();
  const conversation = useConversationStore(
    (state) => state.selectedConversation
  );
  const { data: session } = useSession();
  const handleSendMessage = () => {
    if (!session?.user?.userId || !conversation) {
      toast.error("Please login to send message");
      return;
    }

    sendMessage({
      message,
      conversationId: conversation.id,
      from: session?.user?.userId,
      to: conversation.otherMember.id,
    });
    setMessage("");

  };
  return (
    <div className="flex gap-2 items-center mx-2">
      <Input
        className="flex-1"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={'Enter your message'}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSendMessage();
        
          }
        }}
      />
      <Button
        onClick={handleSendMessage}
      >
        Send
      </Button>
    </div>
  );
};

export default SendMessageBtn