"use client";

import { Badge } from "@/components/ui/badge";
import {StarsBackground} from "@/components/animate-ui/components/backgrounds/stars";
import { GrayTitle , RedTitle } from "@/components/reusable";
import { cn } from "@/lib/utils";
import  {useEffect, useRef, useState} from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { FEATURES, PLACEHOLDERS, STEPS, SUGGESTIONS } from "@/lib/data";

export default function Home() {
  const {isSignedIn} = useAuth();
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [prompt, setPrompt] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if(isFocused || prompt) return;
    const t = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
    }, 3000);
    return () => clearInterval(t);
  }, [isFocused, prompt]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 200) + "px";
  }, [prompt]);

  const handleSubmit = () => {
    if(!prompt.trim() || !isSignedIn) return;
    router.push(`/workspace?prompt=${encodeURIComponent(prompt.trim())}`);
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <main className="min-h-screen bg-[#131111] selection:bg-red-500">
      <section className="relative h-screen flex flex-col items-center overflow-hidden px-4 pb-24 pt-40 text-center">
      <StarsBackground className="absolute inset-0 h-full w-full"
       style={{
            maskImage:
              "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.5) 50%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.5) 50%, transparent 100%)",
          }}/>
      <Badge variant="outline" className="gap-2 p-4 backdrop-blur-sm">
        <div className="h-1 w-1 rounded-full bg-red-500 animate-pulse" />
        Powered by<span className="font-bold">Ai</span>
      </Badge>
      <h1 className="mx-auto max-w-3xl text-balance font serif text-5xl leading-tight tracking-tighter sm:text-5xl lg:text-7x; z-10">
        <GrayTitle>Build your Dream</GrayTitle>
        <br/>
        <RedTitle>from a single prompt.</RedTitle>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-balance text-base leading-relaxed text-white/40 z-10">
          Transform your ideas into reality with the power of artificial intelligence.
        </p>
        <div className="relative mx-auto mt-12 w-full max-w-2xl">
          <div
            className={cn("rounded-2xl border bg-[#1111111] duration-200",
              isFocused 
              ? 'border-red-500/50 ring-1 ring-red-500/50' 
              : 'border-white/10',)}
              >
                <textarea ref={textareaRef}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onKeyDown={handleKeyDown}
                rows={1}
                className="w-full resize-none bg-transparent px-5 pb-4 pt-5 text-sm placeholder:text-white/20 focus:outline-none sm:text-base"
                style={{minHeight: 56, maxHeight: 200}} placeholder={PLACEHOLDERS[placeholderIndex || 0]}
                ></textarea>
              </div>
        </div>      
      </section>
    </main>
  );
}
