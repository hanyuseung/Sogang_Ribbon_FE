import AdminGuard from "@/components/AdminGuard";
import AdminAwardEditor from "@/components/AdminAwardEditor";

export default async function EditAwardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AdminGuard><AdminAwardEditor key={id} awardId={id} /></AdminGuard>;
}
