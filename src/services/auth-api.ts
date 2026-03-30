import { BACKEND_HTTP_URL } from "@/config/backend";

type ChallengeResponse = {
  challengeId: string;
  message: string;
};

export type AuthProfile = {
  id: string;
  walletAddress: string;
  username: string | null;
  createdAt: string;
  achievements: unknown[];
};

export type VerifyResponse = {
  accessToken: string;
  refreshToken: string;
  accessExpiresIn: string;
  accessExpiresAt: number;
  refreshExpiresInSec: number;
  profile: AuthProfile;
  isNewUser?: boolean;
};

type RefreshResponse = Omit<VerifyResponse, "isNewUser">;

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${BACKEND_HTTP_URL}${path}`, init);
  const body = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      (body && typeof body.message === "string" && body.message) ||
      (body && typeof body.error === "string" && body.error) ||
      `Request failed: ${response.status}`;
    throw new Error(message);
  }

  return body as T;
}

export async function getAuthChallenge(): Promise<ChallengeResponse> {
  return requestJson<ChallengeResponse>("/auth/challenge");
}

export async function verifyWalletSignature(input: {
  wallet: string;
  signature: string;
  challengeId: string;
}): Promise<VerifyResponse> {
  return requestJson<VerifyResponse>("/auth/verify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });
}

export async function refreshAuthToken(
  refreshToken: string,
): Promise<RefreshResponse> {
  return requestJson<RefreshResponse>("/auth/refresh", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
  });
}

export async function logoutAuth(refreshToken: string): Promise<void> {
  await requestJson<{ ok: true }>("/auth/logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
  });
}
