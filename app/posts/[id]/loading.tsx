import { Skeleton } from "@/components/ui/skeleton";

export default function DetailLoading() {
  return (
    <div className="w-full">
      <Skeleton className="h-[60px] w-full rounded-xl bg-amber-50" />
      <Skeleton className="h-screen w-full bg-amber-50 mt-2" />
    </div>
  );
}
