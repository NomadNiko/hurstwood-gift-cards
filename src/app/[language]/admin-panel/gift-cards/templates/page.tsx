import type { Metadata } from "next";
import TemplatesList from "./page-content";

export const metadata: Metadata = {
  title: "Gift Card Templates",
};

export default function Page() {
  return <TemplatesList />;
}
