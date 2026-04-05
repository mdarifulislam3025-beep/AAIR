import { NextRequest } from "next/server";
import { adminAssignTransportRequest } from "@/modules/transport/admin/admin.transport.controller";
export async function POST(request: NextRequest, context: { params: { id: string } }) {
  return adminAssignTransportRequest(request, Number(context.params.id));
}
