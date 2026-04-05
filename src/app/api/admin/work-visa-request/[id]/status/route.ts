import { NextRequest } from "next/server";
import { adminUpdateWorkVisaStatus } from "@/modules/work-visa/admin/admin.workvisa.controller";
export async function POST(request: NextRequest, context: { params: { id: string } }) {
  return adminUpdateWorkVisaStatus(request, Number(context.params.id));
}
