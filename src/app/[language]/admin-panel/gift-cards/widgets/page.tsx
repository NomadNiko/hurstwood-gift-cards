import type { Metadata } from "next";
import WidgetsList from "./page-content";

export const metadata: Metadata = {
  title: "Widgets",
};

export default function Page() {
  return <WidgetsList />;
}
