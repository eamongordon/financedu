import { Explore } from "@/components/home/explore";
import { Hero } from "@/components/home/hero";
import { Notice } from "@/components/notice";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <>
      <Notice persistent>
        <div className="h-full flex flex-row items-center px-4 md:justify-center text-sm gap-2 text-muted-foreground">
          Introducing Fin, Our AI assistant!
          <Link
            href="/blog/introducing-fin-ai-assistant"
            target="_blank"
            className="font-semibold flex flex-row items-center justify-center"
          >
            <span className="hidden sm:block">Read the announcement</span>
            <span className="block sm:hidden">Learn more</span>
            <ArrowRight
              size={16}
              className="ml-1"
            />
          </Link>
        </div>
      </Notice>
      <Hero />
      <Explore />
    </>
  );
}
