import { Suspense } from "react";
import ReviewForm from "./ReviewForm";

export default function ReviewNewPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <ReviewForm />
    </Suspense>
  );
}
