import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AAIR - AI Agent for IATA Rules & Airline Regulations",
  description:
    "Expert AI assistant for IATA rules, airline regulations, baggage policies, ticketing, dangerous goods, and more. Trainable by administrators.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-50 text-slate-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}
