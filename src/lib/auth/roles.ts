export type UserRole = "admin" | "creator" | "umkm";
export type AccountStatus = "active" | "inactive" | "suspended" | "pending_verification";

export interface Profile {
  id: string;
  role: UserRole;
  account_status: AccountStatus;
}
