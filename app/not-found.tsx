import Link from "next/link";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
        <FileQuestion size={32} className="text-muted-foreground" />
      </div>
      <h1 className="text-2xl font-bold text-foreground">Page not found</h1>
      <p className="text-muted-foreground">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link href="/dashboard" className="rounded-lg gradient-bg px-6 py-2 text-sm font-medium text-white shadow-md shadow-primary/20">
        Go to Dashboard
      </Link>
    </div>
  );
}
