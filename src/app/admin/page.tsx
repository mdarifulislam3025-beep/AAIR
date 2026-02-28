import AdminPanel from "@/components/AdminPanel";
import { isAdminEnabled } from "@/lib/runtime-config";
import { notFound } from "next/navigation";

export default function AdminPage() {
  if (!isAdminEnabled()) {
    notFound();
  }

  return <AdminPanel />;
}
