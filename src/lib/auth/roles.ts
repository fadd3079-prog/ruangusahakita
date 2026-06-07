export type UserRole = "admin" | "creator" | "umkm";

export interface Profile {
  id: string;
  role: UserRole;
  // TODO: Add other profile fields as needed
}
