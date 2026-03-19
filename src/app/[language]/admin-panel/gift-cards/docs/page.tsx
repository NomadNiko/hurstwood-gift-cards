import type { Metadata } from "next";
import DocsPage from "./page-content";

export const metadata: Metadata = {
  title: "Documentation",
};

export default function Page() {
  return <DocsPage />;
}
