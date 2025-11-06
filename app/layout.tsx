import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bà Hoa & Quán Khiêu Vũ",
  description: "Một câu chuyện video ngắn về bà bán cà phê ở chợ mời bạn vào quán Khiêu vũ Hoa Hoa"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
