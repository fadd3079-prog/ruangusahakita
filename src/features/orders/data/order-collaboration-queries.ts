import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

type Tables = Database["public"]["Tables"];

type ComplaintRow = Tables["complaints"]["Row"];
type CreatorRow = Tables["creator_profiles"]["Row"];
type MessageRow = Tables["messages"]["Row"];
type OrderRow = Tables["orders"]["Row"];
type ReviewRow = Tables["reviews"]["Row"];
type UmkmRow = Tables["umkm_profiles"]["Row"];

export type OrderReviewSummary = {
  comment: string | null;
  communicationRating: number | null;
  createdAt: string;
  id: string;
  isVisible: boolean;
  qualityRating: number | null;
  rating: number;
  timelinessRating: number | null;
};

export type OrderComplaintSummary = {
  createdAt: string;
  description: string;
  id: string;
  openedByLabel: string;
  resolutionNote: string | null;
  status: ComplaintRow["complaint_status"];
  subject: string;
};

export type OrderMessageSummary = {
  createdAt: string;
  id: string;
  isOwn: boolean;
  message: string;
  readAt: string | null;
  senderLabel: string;
  senderId: string;
  senderRole: "creator" | "umkm" | "admin" | "participant";
};

export type OrderCollaborationData = {
  complaints: readonly OrderComplaintSummary[];
  currentUserId: string | null;
  messages: readonly OrderMessageSummary[];
  participants: {
    creator: {
      label: string;
      userId: string | null;
    };
    umkm: {
      label: string;
      userId: string | null;
    };
  };
  review: OrderReviewSummary | null;
};

export async function getOrderCollaborationData(
  orderId: string,
): Promise<OrderCollaborationData> {
  try {
    const supabase = await createClient();
    const [{ data: userData }, orderResult, reviewsResult, complaintsResult, messagesResult] =
      await Promise.all([
        supabase.auth.getUser(),
        supabase.from("orders").select("*").eq("id", orderId).maybeSingle(),
        supabase
          .from("reviews")
          .select("*")
          .eq("order_id", orderId)
          .is("deleted_at", null)
          .maybeSingle(),
        supabase
          .from("complaints")
          .select("*")
          .eq("order_id", orderId)
          .order("created_at", { ascending: false }),
        supabase
          .from("messages")
          .select("*")
          .eq("order_id", orderId)
          .eq("is_internal", false)
          .order("created_at", { ascending: true })
          .limit(100),
      ]);

    const order = orderResult.data;

    if (!order) {
      return emptyCollaboration;
    }

    const participants = await getParticipants(supabase, order);
    const currentUserId = userData.user?.id ?? null;

    return {
      complaints: (complaintsResult.data ?? []).map((complaint) =>
        mapComplaint(complaint, participants),
      ),
      currentUserId,
      messages: (messagesResult.data ?? []).map((message) =>
        mapMessage(message, participants, currentUserId),
      ),
      participants: mapParticipants(participants),
      review: reviewsResult.data ? mapReview(reviewsResult.data) : null,
    };
  } catch {
    return emptyCollaboration;
  }
}

const emptyCollaboration: OrderCollaborationData = {
  complaints: [],
  currentUserId: null,
  messages: [],
  participants: {
    creator: {
      label: "Kreator",
      userId: null,
    },
    umkm: {
      label: "UMKM",
      userId: null,
    },
  },
  review: null,
};

async function getParticipants(
  supabase: Awaited<ReturnType<typeof createClient>>,
  order: OrderRow,
) {
  const [umkmResult, creatorResult] = await Promise.all([
    supabase.from("umkm_profiles").select("*").eq("id", order.umkm_id).maybeSingle(),
    supabase
      .from("creator_profiles")
      .select("*")
      .eq("id", order.creator_id)
      .maybeSingle(),
  ]);

  return {
    creator: creatorResult.data,
    umkm: umkmResult.data,
  };
}

function mapReview(review: ReviewRow): OrderReviewSummary {
  return {
    comment: review.comment,
    communicationRating: review.communication_rating,
    createdAt: review.created_at,
    id: review.id,
    isVisible: review.is_visible,
    qualityRating: review.quality_rating,
    rating: review.rating,
    timelinessRating: review.timeliness_rating,
  };
}

function mapComplaint(
  complaint: ComplaintRow,
  participants: { creator: CreatorRow | null; umkm: UmkmRow | null },
): OrderComplaintSummary {
  return {
    createdAt: complaint.created_at,
    description: complaint.description,
    id: complaint.id,
    openedByLabel: getSenderLabel(complaint.opened_by, participants),
    resolutionNote: complaint.resolution_note,
    status: complaint.complaint_status,
    subject: complaint.subject,
  };
}

function mapMessage(
  message: MessageRow,
  participants: { creator: CreatorRow | null; umkm: UmkmRow | null },
  currentUserId: string | null,
): OrderMessageSummary {
  const senderRole = getSenderRole(message.sender_id, participants);

  return {
    createdAt: message.created_at,
    id: message.id,
    isOwn: Boolean(currentUserId && currentUserId === message.sender_id),
    message: message.message,
    readAt: message.read_at,
    senderLabel: getSenderLabel(message.sender_id, participants),
    senderId: message.sender_id,
    senderRole,
  };
}

function mapParticipants(participants: { creator: CreatorRow | null; umkm: UmkmRow | null }) {
  return {
    creator: {
      label: participants.creator?.display_name ?? "Kreator",
      userId: participants.creator?.user_id ?? null,
    },
    umkm: {
      label: participants.umkm?.business_name ?? "UMKM",
      userId: participants.umkm?.user_id ?? null,
    },
  };
}

function getSenderRole(
  senderId: string,
  participants: { creator: CreatorRow | null; umkm: UmkmRow | null },
) {
  if (participants.umkm?.user_id === senderId) {
    return "umkm";
  }

  if (participants.creator?.user_id === senderId) {
    return "creator";
  }

  return "participant";
}

function getSenderLabel(
  senderId: string,
  participants: { creator: CreatorRow | null; umkm: UmkmRow | null },
) {
  if (participants.umkm?.user_id === senderId) {
    return participants.umkm.business_name;
  }

  if (participants.creator?.user_id === senderId) {
    return participants.creator.display_name;
  }

  return "Participant";
}
