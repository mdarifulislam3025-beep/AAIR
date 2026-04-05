import { NextRequest } from "next/server";
import { adminUpdateTransportStatus } from "@/modules/transport/admin/admin.transport.controller";
export async function POST(request: NextRequest, context: { params: { id: string } }) {
  return adminUpdateTransportStatus(request, Number(context.params.id));
}
