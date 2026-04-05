import { NextRequest, NextResponse } from "next/server";
import { err, ok, parseJson } from "@/modules/common/http";
import { loginUser, registerUser, verifyRegisterOtp } from "@/modules/auth/auth.service";

function isEmail(v: unknown): v is string {
  return typeof v === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export async function registerController(request: NextRequest): Promise<NextResponse> {
  const body = await parseJson(request);
  const { name, email, phone, password, role } = body;

  if (typeof name !== "string" || !isEmail(email) || typeof phone !== "string" || typeof password !== "string") {
    return err("Invalid registration payload", 400);
  }

  try {
    const data = registerUser({
      name,
      email,
      phone,
      password,
      role: role === "admin" || role === "agent" || role === "customer" ? role : "customer",
    });

    return ok(
      { userId: data.userId, otpHint: process.env.NODE_ENV === "development" ? data.otp : undefined },
      "Registration successful. OTP sent to email.",
      201
    );
  } catch (e) {
    return err((e as Error).message, 400);
  }
}

export async function verifyOtpController(request: NextRequest): Promise<NextResponse> {
  const body = await parseJson(request);
  const { email, otp } = body;
  if (!isEmail(email) || typeof otp !== "string") return err("Invalid OTP payload", 400);

  try {
    const data = verifyRegisterOtp({ email, otp });
    return ok(data, "OTP verified successfully");
  } catch (e) {
    return err((e as Error).message, 400);
  }
}

export async function loginController(request: NextRequest): Promise<NextResponse> {
  const body = await parseJson(request);
  const { email, password } = body;
  if (!isEmail(email) || typeof password !== "string") return err("Invalid login payload", 400);

  try {
    const data = loginUser({ email, password });
    return ok(data, "Login successful");
  } catch (e) {
    return err((e as Error).message, 400);
  }
}
