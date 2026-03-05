import type { Metadata } from "next";
import CreateTemplate from "./page-content";

export const metadata: Metadata = {
  title: "Create Gift Card Template",
};

export default function Page() {
  return <CreateTemplate />;
}
