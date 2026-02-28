import ChatInterface from "@/components/ChatInterface";
import { isAgentEnabled } from "@/lib/runtime-config";
import { notFound } from "next/navigation";

export default function Home() {
  if (!isAgentEnabled()) {
    notFound();
  }

  return <ChatInterface />;
}
