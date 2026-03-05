import type { Metadata } from "next";
import GiftCardView from "./page-content";

export const metadata: Metadata = {
  title: "View Gift Card",
};

export default function Page() {
  return <GiftCardView />;
}
