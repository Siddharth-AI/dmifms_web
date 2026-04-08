import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const COOKIE_NAME = "dm23_admin_token";
const TOKEN_VALUE = process.env.ADMIN_SECRET ?? "dm23-secret-fallback";

export function createAdminToken(): string {
  return Buffer.from(TOKEN_VALUE).toString("base64");
}

export function validateAdminToken(token: string): boolean {
  const expected = Buffer.from(TOKEN_VALUE).toString("base64");
  return token === expected;
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME);
  if (!token) return false;
  return validateAdminToken(token.value);
}

export function getTokenFromRequest(request: NextRequest): string | null {
  return request.cookies.get(COOKIE_NAME)?.value ?? null;
}

export { COOKIE_NAME };
