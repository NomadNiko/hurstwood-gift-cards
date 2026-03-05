import type { Metadata } from "next";
import RedeemPage from "./page-content";

export const metadata: Metadata = {
  title: "Redeem Gift Card",
};

export default function Page() {
  return <RedeemPage />;
}
