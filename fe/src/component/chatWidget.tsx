import { Link } from "@tanstack/react-router";
import { ArrowLeft, MessageCircle, Minus, Send, X } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  getConversations,
  getMessages,
  sendMessage as sendMessageRequest,
} from "../api/message";
import { getChatSocket } from "../lib/socket";
import type { ChatMessage, Conversation } from "../models";
import { useUserStore } from "../store/user";

type WidgetMode = "open" | "minimized" | "closed";

const getDisplayName = (user?: {
  full_name?: string | null;
  username?: string | null;
}) => user?.full_name || user?.username || "Người dùng";

const formatTime = (value?: string | null) => {
  if (!value) return "";
  return new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
  }).format(new Date(value));
};

const getPartner = (conversation: Conversation, currentUserId: string) =>
  conversation.buyer_id === currentUserId
    ? conversation.shop
    : conversation.buyer;

const ChatWidget = () => {
  const { user } = useUserStore();
  const [mode, setMode] = useState<WidgetMode>("minimized");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [content, setContent] = useState("");
  const [notice, setNotice] = useState("");
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!user || mode === "closed") return;

    const fetchConversations = async () => {
      setIsLoadingConversations(true);
      setNotice("");
      try {
        const data = await getConversations();
        setConversations(data);
      } catch {
        setNotice("Không thể tải danh sách hội thoại.");
      } finally {
        setIsLoadingConversations(false);
      }
    };

    fetchConversations();
  }, [mode, user]);

  useEffect(() => {
    if (!selectedConversationId) {
      setMessages([]);
      return;
    }

    const fetchMessages = async () => {
      setIsLoadingMessages(true);
      setNotice("");
      try {
        const data = await getMessages(selectedConversationId);
        setMessages(data);
      } catch {
        setNotice("Không thể tải tin nhắn.");
      } finally {
        setIsLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [selectedConversationId]);

  useEffect(() => {
    if (!user) return;

    const socket = getChatSocket();
    if (!socket) return;

    if (!socket.connected) socket.connect();

    const handleNewMessage = (message: ChatMessage) => {
      setConversations((current) => {
        const hasConversation = current.some(
          (conversation) => conversation.id === message.conversation_id,
        );

        if (!hasConversation) return current;

        return current.map((conversation) =>
          conversation.id === message.conversation_id
            ? {
                ...conversation,
                last_message_text: message.content,
                last_message_at: message.created_at,
              }
            : conversation,
        );
      });

      setMode((currentMode) => {
        if (currentMode === "closed") {
          setSelectedConversationId(message.conversation_id);
          return "open";
        }

        if (currentMode === "minimized") setHasNewMessage(true);
        return currentMode;
      });

      if (message.conversation_id !== selectedConversationId) return;

      setMessages((current) => {
        if (current.some((item) => item.id === message.id)) return current;
        return [...current, message];
      });
    };

    socket.on("message:new", handleNewMessage);

    return () => {
      socket.off("message:new", handleNewMessage);
    };
  }, [selectedConversationId, user]);

  useEffect(() => {
    if (!selectedConversationId) return;
    const socket = getChatSocket();
    socket?.emit("conversation:join", selectedConversationId);
  }, [selectedConversationId]);

  useEffect(() => {
    if (mode !== "open") return;
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, mode]);

  if (mode === "closed") return null;

  const selectedConversation = conversations.find(
    (conversation) => conversation.id === selectedConversationId,
  );
  const selectedPartner =
    user && selectedConversation
      ? getPartner(selectedConversation, user.id)
      : undefined;

  const openWidget = () => {
    setMode("open");
    setHasNewMessage(false);
  };

  const handleSendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedContent = content.trim();
    if (!selectedConversationId || !normalizedContent || isSending) return;

    setIsSending(true);
    setNotice("");

    const socket = getChatSocket();
    if (socket?.connected) {
      socket.emit(
        "message:send",
        { conversationId: selectedConversationId, content: normalizedContent },
        (response) => {
          setIsSending(false);
          if (!response.success) {
            setNotice(response.error || "Không thể gửi tin nhắn.");
            return;
          }
          setContent("");
        },
      );
      return;
    }

    try {
      const message = await sendMessageRequest(
        selectedConversationId,
        normalizedContent,
      );
      setMessages((current) => [...current, message]);
      setConversations((current) =>
        current.map((conversation) =>
          conversation.id === selectedConversationId
            ? {
                ...conversation,
                last_message_text: message.content,
                last_message_at: message.created_at,
              }
            : conversation,
        ),
      );
      setContent("");
    } catch {
      setNotice("Không thể gửi tin nhắn.");
    } finally {
      setIsSending(false);
    }
  };

  if (mode === "minimized") {
    return (
      <button
        type="button"
        onClick={openWidget}
        className="fixed bottom-4 right-4 z-[60] inline-flex min-h-12 items-center gap-2 rounded-full bg-[#0f172a] px-5 py-3 text-sm font-bold text-[#fff7ed] shadow-[0_24px_40px_-28px_rgba(15,23,42,0.6)] transition hover:bg-[#334155] md:bottom-6 md:right-6"
        aria-label="Mở tin nhắn">
        <span className="relative">
          <MessageCircle className="h-5 w-5" />
          {hasNewMessage ? (
            <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-[#fcd34d] ring-2 ring-[#0f172a]" />
          ) : null}
        </span>
        Tin nhắn
      </button>
    );
  }

  return (
    <section className="fixed bottom-3 right-3 z-[60] flex h-[min(620px,calc(100vh-6rem))] w-[calc(100vw-1.5rem)] flex-col overflow-hidden rounded-[1.5rem] border border-[#e2e8f0] bg-white text-[#0f172a] shadow-[0_25px_60px_-40px_rgba(15,23,42,0.45)] md:bottom-6 md:right-6 md:h-[520px] md:w-[360px]">
      <header className="border-b border-[#e2e8f0] bg-[#fff7ed] px-4 py-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="mt-1 text-lg font-black text-[#0f172a]">
              {selectedPartner ? getDisplayName(selectedPartner) : "Tin nhắn"}
            </h2>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setMode("minimized")}
              className="grid h-9 w-9 place-items-center rounded-full text-[#334155] transition hover:bg-white"
              aria-label="Ẩn chat">
              <Minus className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setMode("closed")}
              className="grid h-9 w-9 place-items-center rounded-full text-[#334155] transition hover:bg-white"
              aria-label="Đóng chat">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {notice ? (
        <p className="border-b border-rose-100 bg-rose-50 px-4 py-2 text-xs font-medium text-rose-700">
          {notice}
        </p>
      ) : null}

      {!user ? (
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-[#fde68a] text-[#0f172a]">
            <MessageCircle className="h-7 w-7" />
          </span>
          <h3 className="mt-4 text-xl font-black text-[#0f172a]">
            Đăng nhập để chat
          </h3>
          <p className="mt-2 text-sm leading-6 text-[#64748b]">
            Bạn cần đăng nhập để nhắn tin với shop.
          </p>
          <Link
            to="/login"
            className="mt-5 rounded-full bg-[#0f172a] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#334155]">
            Đăng nhập
          </Link>
        </div>
      ) : selectedConversationId && selectedConversation ? (
        <>
          <div className="flex items-center gap-3 border-b border-[#e2e8f0] px-4 py-3">
            <button
              type="button"
              onClick={() => setSelectedConversationId(null)}
              className="grid h-9 w-9 place-items-center rounded-full bg-[#f1f5f9] text-[#334155] transition hover:bg-[#e2e8f0]"
              aria-label="Quay lại danh sách hội thoại">
              <ArrowLeft className="h-4 w-4" />
            </button>
            <span className="grid h-10 w-10 place-items-center rounded-full bg-[#0f172a] text-sm font-bold text-[#fcd34d]">
              {getDisplayName(selectedPartner).charAt(0).toUpperCase()}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-[#0f172a]">
                {getDisplayName(selectedPartner)}
              </p>
              <p className="text-xs text-[#64748b]">
                {selectedConversation.status === "closed"
                  ? "Hội thoại đã đóng"
                  : "Đang trao đổi"}
              </p>
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-[#f8fafc] px-4 py-4">
            {isLoadingMessages ? (
              <p className="py-8 text-center text-sm text-[#64748b]">
                Đang tải tin nhắn...
              </p>
            ) : messages.length === 0 ? (
              <div className="flex h-full items-center justify-center text-center text-sm leading-6 text-[#64748b]">
                Chưa có tin nhắn. Gửi lời chào để bắt đầu.
              </div>
            ) : (
              messages.map((message) => {
                const isMine = message.sender_id === user.id;
                return (
                  <div
                    key={message.id}
                    className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[82%] rounded-3xl px-4 py-3 text-sm shadow-sm ${
                        isMine
                          ? "rounded-br-md bg-[#0f172a] text-[#fff7ed]"
                          : "rounded-bl-md border border-[#e2e8f0] bg-white text-[#334155]"
                      }`}>
                      <p className="whitespace-pre-line leading-relaxed">
                        {message.content}
                      </p>
                      <p
                        className={`mt-1 text-[11px] ${isMine ? "text-[#cbd5e1]" : "text-[#64748b]"}`}>
                        {formatTime(message.created_at)}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={handleSendMessage}
            className="flex gap-2 border-t border-[#e2e8f0] p-3">
            <input
              type="text"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              disabled={selectedConversation.status === "closed" || isSending}
              placeholder={
                selectedConversation.status === "closed"
                  ? "Hội thoại đã đóng"
                  : "Nhập tin nhắn..."
              }
              className="min-w-0 flex-1 rounded-full border border-[#cbd5e1] bg-white px-4 py-3 text-sm text-[#0f172a] outline-none transition focus:border-[#334155] disabled:bg-[#f1f5f9] disabled:text-[#64748b]"
            />
            <button
              type="submit"
              disabled={
                selectedConversation.status === "closed" ||
                !content.trim() ||
                isSending
              }
              className="grid h-12 w-12 place-items-center rounded-full bg-[#0f172a] text-white transition hover:bg-[#334155] disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Gửi tin nhắn">
              <Send className="h-4 w-4" />
            </button>
          </form>
        </>
      ) : (
        <div className="flex-1 overflow-y-auto">
          {isLoadingConversations ? (
            <div className="space-y-3 p-4">
              {[0, 1, 2].map((item) => (
                <div
                  key={item}
                  className="flex animate-pulse gap-3 rounded-2xl bg-[#f8fafc] p-3">
                  <span className="h-10 w-10 rounded-full bg-[#e2e8f0]" />
                  <span className="flex-1 space-y-2 py-1">
                    <span className="block h-3 w-2/3 rounded bg-[#e2e8f0]" />
                    <span className="block h-3 w-full rounded bg-[#e2e8f0]" />
                  </span>
                </div>
              ))}
            </div>
          ) : conversations.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center px-6 text-center">
              <MessageCircle className="h-10 w-10 text-[#b45309]" />
              <p className="mt-3 text-sm font-bold text-[#0f172a]">
                Bạn chưa có hội thoại nào.
              </p>
              <p className="mt-1 text-sm leading-6 text-[#64748b]">
                Hãy bắt đầu từ trang shop hoặc sản phẩm bạn quan tâm.
              </p>
            </div>
          ) : (
            conversations.map((conversation) => {
              const partner = getPartner(conversation, user.id);
              return (
                <button
                  key={conversation.id}
                  type="button"
                  onClick={() => {
                    setSelectedConversationId(conversation.id);
                    setHasNewMessage(false);
                  }}
                  className="flex w-full items-start gap-3 border-b border-[#f1f5f9] px-4 py-3 text-left transition hover:bg-[#fff7ed]">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#0f172a] text-sm font-bold text-[#fcd34d]">
                    {getDisplayName(partner).charAt(0).toUpperCase()}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold text-[#0f172a]">
                      {getDisplayName(partner)}
                    </span>
                    <span className="mt-1 block truncate text-sm text-[#64748b]">
                      {conversation.last_message_text || "Bắt đầu hội thoại"}
                    </span>
                  </span>
                  <span className="shrink-0 text-[11px] text-[#64748b]">
                    {formatTime(conversation.last_message_at)}
                  </span>
                </button>
              );
            })
          )}
        </div>
      )}
    </section>
  );
};

export default ChatWidget;
