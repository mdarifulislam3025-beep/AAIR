import crypto from "crypto";
import { UserRole } from "@/modules/common/types";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

type Claims = {
  sub: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
};

function base64url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function sign(data: string): string {
  return base64url(crypto.createHmac("sha256", JWT_SECRET).update(data).digest());
}

export function generateJwt(payload: { userId: number; email: string; role: UserRole }, expiresInSec = 60 * 60 * 12): string {
  const now = Math.floor(Date.now() / 1000);
  const claims: Claims = {
    sub: String(payload.userId),
    email: payload.email,
    role: payload.role,
    iat: now,
    exp: now + expiresInSec,
  };

  const header = base64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = base64url(JSON.stringify(claims));
  const signature = sign(`${header}.${body}`);
  return `${header}.${body}.${signature}`;
}

export function verifyJwt(token: string): Claims | null {
  const [header, body, signature] = token.split(".");
  if (!header || !body || !signature) return null;

  const expected = sign(`${header}.${body}`);
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    return null;
  }

  try {
    const claims = JSON.parse(Buffer.from(body, "base64").toString("utf-8")) as Claims;
    if (claims.exp < Math.floor(Date.now() / 1000)) return null;
    return claims;
  } catch {
    return null;
  }
}
