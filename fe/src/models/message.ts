export interface ChatUser {
  id: string;
  full_name?: string | null;
  username?: string | null;
  avatar_url?: string | null;
}

export interface Conversation {
  id: string;
  buyer_id: string;
  shop_id: string;
  status: "open" | "closed";
  last_message_text?: string | null;
  last_message_at?: string | null;
  created_at: string;
  updated_at: string;
  buyer: ChatUser;
  shop: ChatUser;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_type: "buyer" | "shop";
  content: string;
  is_read: boolean;
  created_at: string;
  sender: ChatUser;
}
