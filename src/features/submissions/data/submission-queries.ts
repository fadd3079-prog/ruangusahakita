import { STORAGE_BUCKETS, type StorageBucket } from "@/lib/storage/buckets";
import { createStorageSignedUrl } from "@/lib/storage/urls";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

type Tables = Database["public"]["Tables"];

type FileAssetRow = Tables["file_assets"]["Row"];
type RevisionRow = Tables["revisions"]["Row"];
type SubmissionRow = Tables["submissions"]["Row"];

export type DeliveryFileAsset = {
  id: string;
  createdAt: string;
  fileName: string;
  fileSize: number | null;
  mimeType: string | null;
  signedUrl: string | null;
};

export type DeliverySubmission = {
  id: string;
  captionText: string | null;
  createdAt: string;
  description: string | null;
  externalLinks: readonly string[];
  files: readonly DeliveryFileAsset[];
  submissionType: string | null;
  title: string;
  versionNumber: number;
};

export type DeliveryRevision = {
  id: string;
  createdAt: string;
  referenceUrls: readonly string[];
  responseNote: string | null;
  resolvedAt: string | null;
  revisionNote: string;
  revisionStatus: RevisionRow["revision_status"];
  submissionId: string | null;
};

export type OrderDeliveryData = {
  latestSubmission: DeliverySubmission | null;
  revisionLimit: number;
  revisionUsed: number;
  revisions: readonly DeliveryRevision[];
  submissions: readonly DeliverySubmission[];
};

export async function getOrderDeliveryData(
  orderId: string,
): Promise<OrderDeliveryData> {
  try {
    const supabase = await createClient();
    const [submissionsResult, revisionsResult, assetsResult, itemsResult] =
      await Promise.all([
        supabase
          .from("submissions")
          .select("*")
          .eq("order_id", orderId)
          .order("created_at", { ascending: false }),
        supabase
          .from("revisions")
          .select("*")
          .eq("order_id", orderId)
          .order("created_at", { ascending: false }),
        supabase
          .from("file_assets")
          .select("*")
          .eq("order_id", orderId)
          .eq("bucket_name", STORAGE_BUCKETS.PROJECT_RESULTS)
          .is("deleted_at", null)
          .order("created_at", { ascending: false }),
        supabase
          .from("order_items")
          .select("revision_count")
          .eq("order_id", orderId),
      ]);

    const assetsBySubmissionId = await groupAssetsBySubmissionId(
      supabase,
      assetsResult.data ?? [],
    );
    const submissions = (submissionsResult.data ?? []).map((submission) =>
      mapSubmission(submission, assetsBySubmissionId.get(submission.id) ?? []),
    );
    const revisionLimit = Math.max(
      0,
      ...(itemsResult.data ?? []).map((item) => item.revision_count ?? 0),
    );

    return {
      latestSubmission: submissions[0] ?? null,
      revisionLimit,
      revisionUsed: revisionsResult.data?.length ?? 0,
      revisions: (revisionsResult.data ?? []).map(mapRevision),
      submissions,
    };
  } catch {
    return {
      latestSubmission: null,
      revisionLimit: 0,
      revisionUsed: 0,
      revisions: [],
      submissions: [],
    };
  }
}

async function groupAssetsBySubmissionId(
  supabase: Awaited<ReturnType<typeof createClient>>,
  assets: readonly FileAssetRow[],
) {
  const map = new Map<string, DeliveryFileAsset[]>();

  for (const asset of assets) {
    if (!asset.submission_id) {
      continue;
    }

    const current = map.get(asset.submission_id) ?? [];
    current.push(await mapAsset(supabase, asset));
    map.set(asset.submission_id, current);
  }

  return map;
}

async function mapAsset(
  supabase: Awaited<ReturnType<typeof createClient>>,
  asset: FileAssetRow,
): Promise<DeliveryFileAsset> {
  return {
    createdAt: asset.created_at,
    fileName: asset.original_filename ?? asset.file_name,
    fileSize: asset.file_size,
    id: asset.id,
    mimeType: asset.mime_type,
    signedUrl: await createStorageSignedUrl(
      supabase,
      asset.bucket_name as StorageBucket,
      asset.storage_path,
      60 * 30,
    ),
  };
}

function mapSubmission(
  submission: SubmissionRow,
  files: readonly DeliveryFileAsset[],
): DeliverySubmission {
  return {
    captionText: submission.caption_text,
    createdAt: submission.created_at,
    description: submission.description,
    externalLinks: submission.external_links ?? [],
    files,
    id: submission.id,
    submissionType: submission.submission_type,
    title: submission.title,
    versionNumber: submission.version_number,
  };
}

function mapRevision(revision: RevisionRow): DeliveryRevision {
  return {
    createdAt: revision.created_at,
    id: revision.id,
    referenceUrls: revision.reference_urls ?? [],
    responseNote: revision.response_note,
    resolvedAt: revision.resolved_at,
    revisionNote: revision.revision_note,
    revisionStatus: revision.revision_status,
    submissionId: revision.submission_id,
  };
}
