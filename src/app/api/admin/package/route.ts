import { adminCreatePackage, adminListPackages } from "@/modules/packages/admin/admin.package.controller";
export const GET = adminListPackages;
export const POST = adminCreatePackage;
