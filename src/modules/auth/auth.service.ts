import { addAuditLog } from "@/modules/common/audit";
import { hashPassword, verifyPassword } from "@/modules/common/security/password";
import { generateJwt } from "@/modules/common/security/token";
import { loadErpStore, nextId, nowIso, saveErpStore } from "@/modules/common/store/erp.store";
import { UserRole } from "@/modules/common/types";

function generateOTP(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export function registerUser(input: { name: string; email: string; phone: string; password: string; role?: UserRole }) {
  const store = loadErpStore();
  const email = input.email.toLowerCase();
  if (store.users.some((u) => u.email.toLowerCase() === email)) {
    throw new Error("Email already exists");
  }
  if (store.users.some((u) => u.phone === input.phone)) {
    throw new Error("Phone already exists");
  }

  const { hash, salt } = hashPassword(input.password);
  const role = input.role ?? "customer";
  const user = {
    id: nextId(store, "users"),
    name: input.name,
    email,
    phone: input.phone,
    role,
    emailVerified: false,
    passwordHash: hash,
    passwordSalt: salt,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };

  const otp = generateOTP();
  store.users.push(user);
  store.otps = store.otps.filter((o) => o.email !== email);
  store.otps.push({ email, otp, expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString() });
  saveErpStore(store);
  addAuditLog(user.id, "USER_REGISTERED", "users", String(user.id), { email });

  return { userId: user.id, otp }; // OTP would be emailed by email provider integration
}

export function verifyRegisterOtp(input: { email: string; otp: string }) {
  const store = loadErpStore();
  const email = input.email.toLowerCase();
  const otpRow = store.otps.find((o) => o.email === email && o.otp === input.otp);
  if (!otpRow) throw new Error("Invalid OTP");
  if (new Date(otpRow.expiresAt).getTime() < Date.now()) throw new Error("OTP expired");

  const user = store.users.find((u) => u.email === email);
  if (!user) throw new Error("User not found");

  user.emailVerified = true;
  user.updatedAt = nowIso();
  store.otps = store.otps.filter((o) => o.email !== email);
  saveErpStore(store);
  addAuditLog(user.id, "EMAIL_VERIFIED", "users", String(user.id));

  return { verified: true };
}

export function loginUser(input: { email: string; password: string }) {
  const store = loadErpStore();
  const email = input.email.toLowerCase();
  const user = store.users.find((u) => u.email === email);

  if (!user) {
    throw new Error("Your Email is not registered, Please Sign UP");
  }
  if (!user.emailVerified) {
    throw new Error("Email is not verified. Please verify with OTP first.");
  }

  const passOk = verifyPassword(input.password, user.passwordHash, user.passwordSalt);
  if (!passOk) {
    throw new Error(
      "Wrong Password, Please provide your correct Password or Reset your Password."
    );
  }

  const token = generateJwt({ userId: user.id, email: user.email, role: user.role });
  addAuditLog(user.id, "LOGIN_SUCCESS", "users", String(user.id));

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
  };
}
