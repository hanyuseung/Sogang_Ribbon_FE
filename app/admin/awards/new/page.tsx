import AdminGuard from "@/components/AdminGuard";
import AdminAwardEditor from "@/components/AdminAwardEditor";

export default function NewAwardPage() {
  return <AdminGuard><AdminAwardEditor /></AdminGuard>;
}
