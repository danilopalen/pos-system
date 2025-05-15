import ConnectionBanner from "./components/ConnectionBanner";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ConnectionBanner />
        {children}
      </body>
    </html>
  );
}
