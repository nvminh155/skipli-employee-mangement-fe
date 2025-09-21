"use client";

import conversationService from "@/services/conversation.service";
import { useConversationStore } from "@/stores/conversation.store";
import { TConversation, TMessage } from "@/types/conversation";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { UserAvatar } from "./user-avatar";
import { Card, CardContent } from "@/components/ui/card";
import SendMessageBtn from "./send-btn";

const getDate = (seconds: number | undefined) => {
  if (!seconds) return "";
  const date = new Date(seconds * 1000);
  return (
    date.getHours() +
    ":" +
    date.getMinutes() +
    " " +
    date.getDate() +
    "/" +
    date.getMonth() +
    "/" +
    date.getFullYear()
  );
};

const ConversationCard = ({
  conversation,
}: {
  conversation: TConversation;
}) => {
  const { setSelectedConversation } = useConversationStore();
  const { data: conversationData } = useQuery({
    queryKey: ["conversations", conversation.id],
    queryFn: () => conversationService.getById(conversation.id),
    initialData: conversation,
  });

  return (
    <Card
      className="flex flex-col gap-2 px-1 py-2 rounded-md border border-gray-200 max-w-[200px] cursor-pointer shadow-sm"
      onClick={() => {
        setSelectedConversation(conversation);
      }}
    >
      <CardContent>
        <div className="flex items-start gap-2">
          <div className="flex items-center justify-center gap-2 w-6 h-6">
            <UserAvatar src={conversationData?.otherMember.avatar} />
          </div>
          <h1 className="text-sm font-medium">
            {conversationData?.otherMember.fullName}
          </h1>
        </div>
        <p className="text-sm text-gray-500">{conversationData?.lastMessage}</p>

        <p className="text-xs text-gray-500">
          {getDate(conversationData?.updatedAt?.seconds)}
        </p>
      </CardContent>
    </Card>
  );
};

const ListConversation = () => {
  const { conversations } = useConversationStore();
  return (
    <div>
      <h1>List Conversation</h1>
      {conversations.map((conversation) => (
        <ConversationCard key={conversation.id} conversation={conversation} />
      ))}
    </div>
  );
};

const ConversationPage = () => {
  const { connectSocket, disconnectSocket } = useConversationStore();
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.userId) {
      connectSocket(session?.user?.userId);
    }

    return () => {
      disconnectSocket();
    };
  }, [session?.user?.userId]);

  return (
    <div className="flex gap-2 h-full">
      <ListConversation />
      <div className="flex-1 border gap-2 flex flex-col">
        <ListMessage />
        <SendMessageBtn />
      </div>
    </div>
  );
};

const MessageFrom = ({ message }: { message: TMessage }) => {
  return (
    <div className="flex flex-col gap-2 bg-blue-500 ml-auto text-white max-w-[50%] mx-3 rounded-md p-2 mb-3 text-right">
      <h1>{message.message}</h1>
      <p>{getDate(message.createdAt / 1000)}</p>
    </div>
  );
};

const MessageTo = ({ message }: { message: TMessage }) => {
  return (
    <div className="flex flex-col gap-2 bg-gray-400 mr-auto max-w-[50%] mx-3 rounded-md p-2 mb-3 text-white">
      <h1>{message.message}</h1>
      <p>{getDate(message.createdAt / 1000)}</p>
    </div>
  );
};
const ListMessage = () => {
  const { messages } = useConversationStore();
  const { data: session } = useSession();
  const messagesRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);
  return (
    <div className=" border flex-1 max-h-[500px] flex flex-col overflow-y-scroll" ref={messagesRef}>
      <h1>List Message</h1>
      {messages.map((message) => {
        const userId = session?.user?.userId;
        if (message.from.id === userId) {
          return <MessageFrom key={message.id} message={message} />;
        }
        return <MessageTo key={message.id} message={message} />;
      })}
    </div>
  );
};

export default ConversationPage;
