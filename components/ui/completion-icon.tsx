import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CompletionIconProps {
  isComplete: boolean;
  icon: React.ReactNode;
  isCurrent?: boolean;
}

export function CompletionIcon({ isComplete, icon, isCurrent }: CompletionIconProps) {
  return (
    <div className="relative">
      <div className={
        cn("border flex justify-center items-center size-8 shrink-0 rounded-md relative",
          isCurrent ? "dark:border-muted-foreground" : "",
          isComplete ? "border-primary text-primary" : "")}
      >
        {icon}
        {isComplete && (
          <div className="text-white absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-primary rounded-full size-4 flex items-center justify-center [&_svg]:size-[11px]">
          <Check />
        </div>
        )}
      </div>
    </div>
  );
}
