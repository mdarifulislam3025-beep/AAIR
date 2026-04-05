import { NextRequest, NextResponse } from "next/server";
import { authorizeRole } from "@/modules/common/middleware/auth";
import { ok } from "@/modules/common/http";
import { loadErpStore } from "@/modules/common/store/erp.store";

export async function userListNotifications(request: NextRequest): Promise<NextResponse> {
  const auth = authorizeRole(request, "user");
  if (auth instanceof NextResponse) return auth;
  const store = loadErpStore();
  return ok(store.notifications.filter((n) => n.userId === auth.userId), "Notifications fetched");
}
