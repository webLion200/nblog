import { Skeleton } from "@/components/ui/skeleton";

export default function DetailLoading() {
  return (
    <div>
      <Skeleton className="h-[60px] w-full rounded-xl" />
      <Skeleton className="h-screen w-full" />
    </div>
  );
}
