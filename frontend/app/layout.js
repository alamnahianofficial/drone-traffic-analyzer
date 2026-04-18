import "./globals.css";

export const metadata = {
  title: "Smart Drone Traffic Analyzer",
  description:
    "Computer Vision pipeline for aerial vehicle detection & tracking",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased bg-white text-gray-900">{children}</body>
    </html>
  );
}
