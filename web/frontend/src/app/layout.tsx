import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ToasterProvider from "@/components/toaster-provider";

const inter = Inter({ subsets: ["latin", "vietnamese"] });

export const metadata: Metadata = {
  title: "JobViet AI – Tìm việc thông minh",
  description: "Nền tảng tìm việc AI hỗ trợ tạo CV, đánh giá độ phù hợp và theo dõi ứng tuyển",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        {children}
        <ToasterProvider />
      </body>
    </html>
  );
}
