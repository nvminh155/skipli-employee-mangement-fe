import { TConversation, TMessage } from "@/types/conversation";
import { create } from "zustand";
import { io, Socket } from "socket.io-client";
import { QueryClient } from "@tanstack/react-query";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

type TSendMessage = {
  message: string;
  conversationId: string;
  from: string;
  to: string;
};

type TConversationStore = {
  conversations: TConversation[];
  socket: Socket | null;
  setSocket: (socket: Socket | null) => void;
  setConversations: (conversations: TConversation[]) => void;
  connectSocket: (userId: string) => void;
  disconnectSocket: () => void;
  selectedConversation: TConversation | null;
  setSelectedConversation: (conversation: TConversation) => void;
  messages: TMessage[];
  setMessages: (messages: TMessage[]) => void;
  sendMessage: (message: TSendMessage) => void;
};

export const useConversationStore = create<TConversationStore>((set, get) => {
  const queryClient = new QueryClient();

  return {
    conversations: [],
    socket: null,
    messages: [],
    selectedConversation: null,
    setSelectedConversation: (conversation: TConversation) => {
      const socket = get().socket;
      if (socket) {
        socket.emit("getMessages", conversation.id);
      }
      set({ selectedConversation: conversation });
    },
    setSocket: (socket: Socket | null) => set({ socket }),
    setConversations: (conversations: TConversation[]) =>
      set({ conversations }),
    sendMessage: (message: TSendMessage) => {
      const socket = get().socket;
      if (socket) {
        socket.emit("sendMessage", message);
      }
    },
    setMessages: (messages: TMessage[]) => set({ messages }),
    connectSocket: (userId: string) => {
      const socket = io(BASE_URL + "/chat", {
        auth: { userId },
      });
      get().setSocket(socket);

      socket.on("connect", () => {
        console.log("connected to conversations socket");
      });

      socket.on("rooms", (rooms: TConversation[]) => {
        set({ conversations: rooms });
        if (rooms.length > 0) get().setSelectedConversation(rooms[0]);
      });

      socket.on("messages", (messages: TMessage[]) => {
        set({ messages });
      });

      socket.on(
        "updateConversation",
        (conversation: Pick<TConversation, "id" | "lastMessage">) => {
          console.log("updateConversation", conversation);
          queryClient.invalidateQueries({
            queryKey: ["conversations", conversation.id],
            exact: true,
          });
        }
      );

      socket.on("receiveMessage", (message: TMessage) => {
        console.log("receiveMessage", message);
        set({ messages: [...get().messages, message] });
      });
    },
    disconnectSocket: () => {
      get().socket?.disconnect();
      get().setSocket(null);
    },
  };
});
