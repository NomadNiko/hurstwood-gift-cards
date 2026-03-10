import type { Metadata } from "next";
import EditWidgetPageContent from "./page-content";

export const metadata: Metadata = {
  title: "Edit Widget",
};

export default function Page() {
  return <EditWidgetPageContent />;
}
