import { TUser } from "./user";

export type TConversation = {
  id: string;
  lastMessage: string;
  updatedAt: {
    seconds: number;
  };
  createdAt: string;
  members: TUser[];
  otherMember: TUser;
}

export type TMessage = {
  id: string;
  from: TUser;
  to: TUser;
  message: string;
  conversationId: string;
  createdAt: number
}