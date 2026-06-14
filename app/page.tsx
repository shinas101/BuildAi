"use client";

import { Badge } from "@/components/ui/badge";
import {StarsBackground} from "@/components/animate-ui/components/backgrounds/stars";
import { GrayTitle , RedTitle, SectionHeading, SectionLabel } from "@/components/reusable";
import { cn } from "@/lib/utils";
import  {useEffect, useRef, useState} from "react";
import { PricingTable, SignInButton, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { FEATURES, PLACEHOLDERS, STEPS, SUGGESTIONS } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { ArrowRight,ChevronRight }  from "lucide-react";
import { DrawerRoot } from "@base-ui/react";


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

  const handleSuggestions = (s: string) => {
    setPrompt(s);
    textareaRef.current?.focus();
  }

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
                <div className="flex items-center justify-between border-t border-white/6 px-4 py-2.5">
                  <span className="text-xs text-white/20">
                  Press ⏎ to generate your project . Shift + ⏎ for new line
                  </span>
                  {isSignedIn ? (<Button onClick={handleSubmit}
                  disabled={!prompt.trim()}
                  className="h-8 rounded-full bg-red-400 px-5 font-semibold"
                  variant={prompt.trim() ? "default" : "secondary"}>
                    Generate
                  </Button>) : (<SignInButton mode="modal">
                    <Button className="h-8 rounded-full bg-red-500 px-5 font-semibold">
                    Generate
                    <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </SignInButton>)}
                </div>
              </div>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                  key={s}
                  className="rounded-full border border-red-500/20 px-3 py-1 text-xs text-white/20 cursor-pointer hover:bg-white/5"
                  onClick={() => handleSuggestions(s)}>
                  {s}
                  </button>
                ))}
              </div>
        </div> 
        <p className="mt-10 text-xs text-white/20">
          No credit card required. Get started for free and explore the endless possibilities of AI-powered project generation.
        </p>   
      </section>

      {/* Project Creation Mockup Section */}
      <section className="relative py-24 px-4">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <Badge variant="outline" className="gap-2 p-4 backdrop-blur-sm mb-6 inline-flex">
              <div className="h-1 w-1 rounded-full bg-red-500 animate-pulse" />
              Project Creation
            </Badge>
            <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl mb-4">
              <GrayTitle>Watch your projects</GrayTitle>
              <br/>
              <RedTitle>come to life instantly.</RedTitle>
            </h2>
            <p className="text-white/40 max-w-2xl mx-auto">
              See how our AI transforms your ideas into fully functional applications in real-time.
            </p>
          </div>

          {/* Browser Mockup */}
          <div className="relative rounded-2xl border border-white/10 bg-gradient-to-b from-[#1a1818] to-[#131111] overflow-hidden shadow-2xl" style={{ animation: "float 10s ease-in-out infinite" }}>
            <div className="pointer-events-none absolute -left-12 -top-10 h-40 w-40 rounded-full bg-red-500/10 blur-3xl" style={{ animation: "float 14s ease-in-out infinite" }} />
            <div className="pointer-events-none absolute -right-12 bottom-10 h-32 w-32 rounded-full bg-white/5 blur-3xl" style={{ animation: "float 18s ease-in-out infinite" }} />
            {/* Browser Header */}
            <div className="bg-[#0a0a0a] border-b border-white/5 px-6 py-4 flex items-center gap-4">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/30" />
                <div className="w-3 h-3 rounded-full bg-green-500/30" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="bg-white/5 border border-white/10 rounded-full px-4 py-2 text-xs text-white/50 max-w-md">
                  build-ai.example.com/projects/new
                </div>
              </div>
            </div>

            {/* Browser Content */}
            <div className="p-8 md:p-12 bg-gradient-to-br from-[#1a1818] via-[#131111] to-[#0a0a0a]">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Left: Prompt + Todo Section */}
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-semibold text-white/80 block mb-3">
                      AI Prompt
                    </label>
                    <textarea
                      placeholder="Build a modern AI-powered dashboard app with authentication, database, and deploy scripts."
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/20 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 resize-none h-32"
                      disabled
                    />
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-semibold text-white/80">Project TODO</span>
                      <span className="text-xs text-white/40">Auto-generated</span>
                    </div>
                    <div className="space-y-3">
                      {[
                        "Define app goals and page structure",
                        "Generate frontend UI and navigation",
                        "Create backend API and database models",
                        "Add authentication and deployment config",
                      ].map((item) => (
                        <div key={item} className="flex items-start gap-3">
                          <span className="mt-1 h-3 w-3 rounded-full bg-red-500" />
                          <p className="text-sm text-white/60">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                    <h3 className="text-sm font-semibold text-white/80 mb-3">Project Status</h3>
                    <div className="grid gap-3">
                      {[
                        { label: "Prompt processed", done: true },
                        { label: "Files generated", done: true },
                        { label: "Preview ready", done: false },
                      ].map((step) => (
                        <div key={step.label} className="flex items-center justify-between gap-3 text-sm text-white/60">
                          <span>{step.label}</span>
                          <span className={`rounded-full px-2 py-1 text-[11px] ${step.done ? "bg-emerald-500/15 text-emerald-300" : "bg-white/5 text-white/50"}`}>
                            {step.done ? "Done" : "Pending"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Preview Section */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-white/80 mb-4">Project Preview</h3>
                    <div className="bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/20 rounded-lg p-6 min-h-60 flex items-center justify-center" style={{ animation: "float 12s ease-in-out infinite" }}>
                      <div className="text-center">
                        <div className="w-12 h-12 bg-red-500/20 rounded-lg mx-auto mb-4 flex items-center justify-center">
                          <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                        <p className="text-white/60 text-sm">
                          Generating your project files...
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-white/80 mb-3">Features Included</h3>
                    <div className="space-y-2">
                      {["✓ Authentication", "✓ Database Setup", "✓ API Routes", "✓ UI Components"].map((feature) => (
                        <div key={feature} className="flex items-center gap-3 text-sm text-white/60">
                          <span className="text-red-400">{feature.split(" ")[0]}</span>
                          <span>{feature.split(" ").slice(1).join(" ")}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
            <section className="px-4 pb-32">
        <div className="mx-auto mb-14 max-w-5xl text-center">
          <SectionLabel>Everything you need</SectionLabel>
          <SectionHeading gray="From prompt" blue="to production." />
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/6 bg-white/6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, label, desc }) => (
            <div
              key={label}
              className="group bg-[#0a0a0a] p-7 hover:bg-[#0f0f0f]"
            >
              <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg border border-white/8 bg-white/4 group-hover:border-white/15 group-hover:bg-white/8">
                <Icon className="h-4 w-4 text-white/60 group-hover:text-blue-400/70" />
              </div>
              <p className="mb-2 text-sm font-semibold">{label}</p>
              <p className="text-sm leading-relaxed text-white/40">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    <section className="px-4 pb-32">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <SectionLabel>How it works</SectionLabel>
          <SectionHeading gray="Four steps" blue="to a working app." />
        </div>

        <div className="mx-auto max-w-3xl">
          {STEPS.map((step, i) => (
            <div key={step.number} className="flex gap-6">
              <div className="flex flex-col items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/4">
                  <span className="font-mono text-xs font-semibold text-white/50">
                    {step.number}
                  </span>
                </div>

                {i < STEPS.length - 1 && (
                  <div className="mt-2 h-full w-px bg-white/6" />
                )}
              </div>

              <div className="pb-10 pt-1.5">
                <p className="mb-1.5 text-sm font-semibold sm:text-base">
                  {step.label}
                </p>

                <p className="text-sm leading-relaxed text-white/40">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="px-4 pb-32">
        <div className="mx-auto mb-14 max-w-5xl text-center">
          <SectionLabel>Simple pricing</SectionLabel>
          <SectionHeading gray="Start free," blue="scale when ready." />

          <p className="mx-auto mt-4 max-w-sm text-sm text-white/35">
            No credit card required. Upgrade or downgrade anytime.
          </p>
        </div>
        <div className="mx-auto max-w-5xl">
          <PricingTable
          checkoutProps={
            {
              appearance:{
                elements:
                {
                  drawerRoot: {
                    zIndex:2000,
                  }
                }
              }
            }
          }/>
        </div>
      </section>

      <section className="relative mx-auto mb-32 max-w-5xl overflow-hidden rounded-2xl border border-white/8 px-10 py-24 text-center">
        <StarsBackground
          className="absolute inset-0 h-full w-full"
          style={{
            maskImage:
              "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)",
          }}
        />

        <SectionHeading gray="Start building," blue="for free." />

        <p className="mb-8 text-sm leading-relaxed text-white/40">
          Get 10 free generations on sign up. No credit card required.
          <br />
          Upgrade when you&apos;re ready.
        </p>

        <SignInButton mode="modal">
          <Button
            size="lg"
            className="relative h-11 rounded-full bg-white px-8"
          >
            Get started free
            <ChevronRight className="h-4 w-4" />
          </Button>
        </SignInButton>
      </section>
    </main>
  );
}
