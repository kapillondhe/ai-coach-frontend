import { apiFetchJson } from "./client";

export interface ProfileData {
  name: string | null;
  weight_kg: number | null;
  injury_notes: string | null;
  field_sources: Record<string, "chat" | "user">;
}

export type ProfileUpdate = Partial<
  Pick<ProfileData, "name" | "weight_kg" | "injury_notes">
>;

export const getProfile = (signal?: AbortSignal): Promise<ProfileData> =>
  apiFetchJson<ProfileData>("/api/profile", { signal });

export const updateProfile = (update: ProfileUpdate): Promise<ProfileData> =>
  apiFetchJson<ProfileData>("/api/profile", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(update),
  });
