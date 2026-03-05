import type { Metadata } from "next";
import CreateWidget from "./page-content";

export const metadata: Metadata = {
  title: "Create Widget",
};

export default function Page() {
  return <CreateWidget />;
}
