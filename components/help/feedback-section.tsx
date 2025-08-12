"use client";

import { useState } from "react";
import Link from "next/link";
import { ThumbsUp, ThumbsDown } from "lucide-react";

export function FeedbackSection() {
  const [feedback, setFeedback] = useState<"yes" | "no" | null>(null);
  return (
    <div className="rounded-lg mb-8">
      <h3 className="text-lg font-semibold text-card-foreground mb-4">
        Was this article helpful?
      </h3>
      <div className="flex items-center gap-4">
        <button
          className={
            `flex items-center gap-2 px-4 py-2 rounded-lg transition-colors border ` +
            (feedback === "yes"
              ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-500 border-green-400"
              : "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-500 border-transparent hover:bg-green-100 dark:hover:bg-green-900/30")
          }
          onClick={() => setFeedback("yes")}
          aria-label="Yes, helpful"
        >
          <ThumbsUp className="w-4 h-4" />
          Yes, helpful
        </button>
        <button
          className={
            `flex items-center gap-2 px-4 py-2 rounded-lg transition-colors border ` +
            (feedback === "no"
              ? "bg-destructive/20 text-destructive border-destructive"
              : "bg-destructive/10 text-destructive border-transparent hover:bg-destructive/20")
          }
          onClick={() => setFeedback("no")}
          aria-label="No, not helpful"
        >
          <ThumbsDown className="w-4 h-4" />
          No, not helpful
        </button>
      </div>
      {feedback === "yes" && (
        <div className="text-green-700 dark:text-green-500 font-medium py-4">Thank you for your feedback!</div>
      )}
      {feedback === "no" && (
        <div className="py-4">
          <div className="text-destructive font-medium mb-2">Sorry this article wasn&apos;t helpful.</div>
          <div>
            <span className="text-muted-foreground"><Link href="mailto:info@financedu.org" className="underline text-primary">Contact Us</Link> for further assistance.</span>
          </div>
        </div>
      )}
    </div>
  );
}
