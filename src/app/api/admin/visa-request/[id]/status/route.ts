import { NextRequest } from "next/server";
import { adminUpdateVisaStatus } from "@/modules/visa/admin/admin.visa.controller";
export async function POST(request: NextRequest, context: { params: { id: string } }) {
  return adminUpdateVisaStatus(request, Number(context.params.id));
}
