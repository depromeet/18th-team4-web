import { cookies, headers } from "next/headers";
import { httpBase } from "./httpBase";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

function sanitizeCookieValue(value?: string): string | null {
  if (!value) return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  // Prevent header injection / malformed Cookie header values.
  if (/[\u0000-\u001F\u007F;\r\n]/.test(trimmed)) return null;

  // Defensive size limit for a single cookie value.
  if (trimmed.length > 4096) return null;

  return trimmed;
}

async function getServerToken(): Promise<Record<string, string>> {
  const cookieStore = await cookies();
  const accessToken = sanitizeCookieValue(
    cookieStore.get("accessToken")?.value,
  );
  const refreshToken = sanitizeCookieValue(
    cookieStore.get("refreshToken")?.value,
  );

  const cookieParts: string[] = [];
  if (accessToken) cookieParts.push(`accessToken=${accessToken}`);
  if (refreshToken) cookieParts.push(`refreshToken=${refreshToken}`);

  return cookieParts.length > 0 ? { Cookie: `${cookieParts.join("; ")};` } : {};
}

async function getForwardedIp(): Promise<Record<string, string>> {
  const headerList = await headers();
  const ip =
    headerList.get("x-forwarded-for") || headerList.get("x-real-ip") || "";

  return ip ? { "x-forwarded-for": ip } : {};
}

export const serverAuthHttp = {
  get: async <T>(url: string) => {
    const cookieHeader = await getServerToken();
    const forwardedIp = (await getForwardedIp())["x-forwarded-for"];

    return httpBase<T>(`${API_URL}${url}`, {
      method: "GET",
      headers: cookieHeader,
      xForwardedFor: forwardedIp,
      cache: "no-store",
    });
  },

  post: async <T>(url: string, body?: Request) => {
    const cookieHeader = await getServerToken();
    return httpBase<T>(`${API_URL}${url}`, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
      headers: cookieHeader,
      cache: "no-store",
    });
  },

  put: async <T>(url: string, body?: Request) => {
    const cookieHeader = await getServerToken();
    return httpBase<T>(`${API_URL}${url}`, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
      headers: cookieHeader,
      cache: "no-store",
    });
  },

  delete: async <T>(url: string) => {
    const cookieHeader = await getServerToken();
    return httpBase<T>(`${API_URL}${url}`, {
      method: "DELETE",
      headers: cookieHeader,
      cache: "no-store",
    });
  },
};
