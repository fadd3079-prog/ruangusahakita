"use client";

import { useRouter } from "next/navigation";
import { RefreshCw, Send } from "lucide-react";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import type { FormEvent } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  markOrderMessagesReadAction,
  sendOrderMessageInlineAction,
} from "@/features/orders/actions/order-collaboration-actions";
import type {
  OrderCollaborationData,
  OrderMessageSummary,
} from "@/features/orders/data/order-collaboration-queries";
import { formatDate } from "@/lib/formatters/date";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";

type MessageRow = Database["public"]["Tables"]["messages"]["Row"];

type RealtimeOrderChatProps = {
  collaboration: OrderCollaborationData;
  orderId: string;
};

type LocalMessage = OrderMessageSummary & {
  deliveryState?: "failed" | "sending" | "sent";
  temp?: boolean;
};

const roleLabels = {
  admin: "Admin",
  creator: "Kreator",
  participant: "Participant",
  umkm: "UMKM",
} as const;

export function RealtimeOrderChat({
  collaboration,
  orderId,
}: RealtimeOrderChatProps) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [localMessages, setLocalMessages] = useState<readonly LocalMessage[]>([]);
  const messages = useMemo(
    () => mergeMessages(collaboration.messages, localMessages),
    [collaboration.messages, localMessages],
  );
  const [input, setInput] = useState("");
  const [connectionState, setConnectionState] = useState<
    "connected" | "connecting" | "fallback"
  >("connecting");
  const [isPending, startTransition] = useTransition();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const shouldAutoScrollRef = useRef(true);

  useEffect(() => {
    if (!shouldAutoScrollRef.current) {
      return;
    }

    scrollRef.current?.scrollTo({
      behavior: "smooth",
      top: scrollRef.current.scrollHeight,
    });
  }, [messages.length]);

  useEffect(() => {
    void markOrderMessagesReadAction(orderId);

    const channel = supabase
      .channel(`order-chat:${orderId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          filter: `order_id=eq.${orderId}`,
          schema: "public",
          table: "messages",
        },
        (payload) => {
          const row = payload.new as MessageRow;

          if (row.is_internal) {
            return;
          }

          const nextMessage = mapRealtimeMessage(row, collaboration);

          shouldAutoScrollRef.current = isNearBottom(scrollRef.current);

          setLocalMessages((currentMessages) => {
            const withoutOptimistic = currentMessages.filter(
              (message) =>
                !(
                  message.temp &&
                  message.senderId === row.sender_id &&
                  message.message === row.message
                ),
            );

            if (withoutOptimistic.some((message) => message.id === row.id)) {
              return withoutOptimistic;
            }

            return [...withoutOptimistic, nextMessage];
          });
        },
      )
      .subscribe((status) => {
        setConnectionState(status === "SUBSCRIBED" ? "connected" : "connecting");
      });

    const timeout = window.setTimeout(() => {
      setConnectionState((current) =>
        current === "connected" ? "connected" : "fallback",
      );
    }, 5000);

    return () => {
      window.clearTimeout(timeout);
      void supabase.removeChannel(channel);
    };
  }, [collaboration, orderId, supabase]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const message = input.trim();

    if (!message || isPending) {
      return;
    }

    const tempId = `temp-${crypto.randomUUID()}`;
    const optimisticMessage: LocalMessage = {
      createdAt: new Date().toISOString(),
      deliveryState: "sending",
      id: tempId,
      isOwn: true,
      message,
      readAt: null,
      senderId: collaboration.currentUserId ?? "current-user",
      senderLabel: getCurrentSenderLabel(collaboration),
      senderRole: getCurrentSenderRole(collaboration),
      temp: true,
    };

    shouldAutoScrollRef.current = isNearBottom(scrollRef.current);
    setInput("");
    setLocalMessages((currentMessages) => [...currentMessages, optimisticMessage]);

    startTransition(async () => {
      const result = await sendOrderMessageInlineAction(orderId, message);

      if (!result.ok) {
        setLocalMessages((currentMessages) =>
          currentMessages.map((currentMessage) =>
            currentMessage.id === tempId
              ? { ...currentMessage, deliveryState: "failed" }
              : currentMessage,
          ),
        );
        toast.error(result.message);
        return;
      }

      toast.success(result.message);

      setLocalMessages((currentMessages) =>
        currentMessages.map((currentMessage) =>
          currentMessage.id === tempId
            ? { ...currentMessage, deliveryState: "sent" }
            : currentMessage,
        ),
      );
    });
  }

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-medium text-muted-foreground">
          {connectionState === "connected"
            ? "Realtime aktif"
            : connectionState === "fallback"
              ? "Mode refresh manual"
              : "Menghubungkan realtime"}
        </p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 rounded-full text-xs"
          onClick={() => router.refresh()}
        >
          <RefreshCw className="size-3.5" aria-hidden="true" />
          Refresh
        </Button>
      </div>

      <div
        ref={scrollRef}
        onScroll={(event) => {
          shouldAutoScrollRef.current = isNearBottom(event.currentTarget);
        }}
        className="max-h-[380px] space-y-3 overflow-y-auto rounded-2xl border border-border/70 bg-background p-3 sm:max-h-[420px]"
      >
        {messages.length > 0 ? (
          messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))
        ) : (
          <p className="rounded-xl border border-dashed border-border bg-card p-4 text-sm text-muted-foreground">
            Belum ada pesan di order ini.
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Tulis pesan singkat..."
          className="h-11"
          aria-label="Pesan order"
          disabled={isPending}
        />
        <Button
          type="submit"
          disabled={isPending || !input.trim()}
          className="h-11 shrink-0"
          aria-busy={isPending}
        >
          <Send className="size-4" aria-hidden="true" />
          <span className="hidden sm:inline">{isPending ? "Mengirim..." : "Kirim"}</span>
        </Button>
      </form>
    </div>
  );
}

function isNearBottom(element: HTMLDivElement | null) {
  if (!element) {
    return true;
  }

  return element.scrollHeight - element.scrollTop - element.clientHeight < 72;
}

function mergeMessages(
  serverMessages: readonly OrderMessageSummary[],
  localMessages: readonly LocalMessage[],
): readonly LocalMessage[] {
  const serverMessageKeys = new Set(
    serverMessages.map((message) => `${message.senderId}:${message.message}`),
  );
  const merged = new Map<string, LocalMessage>();

  serverMessages.forEach((message) => {
    merged.set(message.id, message);
  });

  localMessages.forEach((message) => {
    const duplicateKey = `${message.senderId}:${message.message}`;

    if (message.temp && serverMessageKeys.has(duplicateKey)) {
      return;
    }

    merged.set(message.id, message);
  });

  return Array.from(merged.values()).sort(
    (first, second) =>
      new Date(first.createdAt).getTime() - new Date(second.createdAt).getTime(),
  );
}

function MessageBubble({ message }: { message: LocalMessage }) {
  return (
    <article
      className={cn(
        "max-w-[88%] rounded-2xl border px-4 py-3",
        message.isOwn
          ? "ml-auto border-primary/20 bg-primary text-primary-foreground"
          : "border-border/70 bg-card text-foreground",
      )}
    >
      <div className="mb-1 flex flex-wrap items-center gap-2 text-xs">
        <span className="font-semibold">{message.senderLabel}</span>
        <span className={message.isOwn ? "text-white/70" : "text-muted-foreground"}>
          {roleLabels[message.senderRole]}
        </span>
      </div>
      <p className="break-words text-sm leading-6">{message.message}</p>
      <div
        className={cn(
          "mt-2 flex flex-wrap items-center gap-2 text-xs",
          message.isOwn ? "text-white/70" : "text-muted-foreground",
        )}
      >
        <span>{formatDate(message.createdAt)}</span>
        {message.deliveryState === "sending" ? <span>Mengirim...</span> : null}
        {message.deliveryState === "failed" ? <span>Gagal terkirim</span> : null}
      </div>
    </article>
  );
}

function mapRealtimeMessage(
  row: MessageRow,
  collaboration: OrderCollaborationData,
): OrderMessageSummary {
  const senderRole = getSenderRole(row.sender_id, collaboration);

  return {
    createdAt: row.created_at,
    id: row.id,
    isOwn: row.sender_id === collaboration.currentUserId,
    message: row.message,
    readAt: row.read_at,
    senderId: row.sender_id,
    senderLabel: getSenderLabel(row.sender_id, collaboration),
    senderRole,
  };
}

function getCurrentSenderRole(
  collaboration: OrderCollaborationData,
): OrderMessageSummary["senderRole"] {
  return getSenderRole(collaboration.currentUserId ?? "", collaboration);
}

function getCurrentSenderLabel(collaboration: OrderCollaborationData) {
  return getSenderLabel(collaboration.currentUserId ?? "", collaboration);
}

function getSenderRole(
  senderId: string,
  collaboration: OrderCollaborationData,
): OrderMessageSummary["senderRole"] {
  if (senderId && senderId === collaboration.participants.umkm.userId) {
    return "umkm";
  }

  if (senderId && senderId === collaboration.participants.creator.userId) {
    return "creator";
  }

  return "participant";
}

function getSenderLabel(senderId: string, collaboration: OrderCollaborationData) {
  if (senderId && senderId === collaboration.participants.umkm.userId) {
    return collaboration.participants.umkm.label;
  }

  if (senderId && senderId === collaboration.participants.creator.userId) {
    return collaboration.participants.creator.label;
  }

  return "Participant";
}
