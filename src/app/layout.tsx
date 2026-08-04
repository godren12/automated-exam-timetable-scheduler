import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Automated Timetable Scheduler",
  description: "Exam and Lecture Timetable Management System",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}