import "./globals.css";

export const metadata = {
  title: "PayRent — Rent, reconciled",
  description: "A clear rent ledger for property owners, managers and tenants."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
