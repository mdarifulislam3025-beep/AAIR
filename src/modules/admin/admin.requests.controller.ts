import { NextRequest, NextResponse } from "next/server";
import { authorizeRole } from "@/modules/common/middleware/auth";
import { ok } from "@/modules/common/http";
import { loadErpStore } from "@/modules/common/store/erp.store";

export async function adminRequestsDashboard(request: NextRequest): Promise<NextResponse> {
  const auth = authorizeRole(request, "admin");
  if (auth instanceof NextResponse) return auth;

  const store = loadErpStore();
  const data = {
    flights: store.flightRequests.length,
    visa: store.genericRequests.filter((r) => r.module === "visa").length,
    workVisa: store.genericRequests.filter((r) => r.module === "workVisa").length,
    transport: store.genericRequests.filter((r) => r.module === "transport").length,
    packages: store.genericRequests.filter((r) => r.module === "package").length,
    pendingSlaBreaches: store.flightRequests.filter((f) => f.status === "PENDING" && Date.now() - new Date(f.createdAt).getTime() > 15 * 60 * 1000).length,
  };

  return ok(data, "Admin request dashboard fetched");
}
