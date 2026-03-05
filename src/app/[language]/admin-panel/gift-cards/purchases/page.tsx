import type { Metadata } from "next";
import PurchasesList from "./page-content";

export const metadata: Metadata = {
  title: "Gift Card Purchases",
};

export default function Page() {
  return <PurchasesList />;
}
