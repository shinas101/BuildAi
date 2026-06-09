import React from 'react'
import Link from 'next/link'
import { Zap } from 'lucide-react'
import { Show , SignInButton , SignUpButton , UserButton } from '@clerk/nextjs'
import { Button } from './ui/button'
import { ArrowRight } from 'lucide-react'

const Header = () => {
  return (
    <header className="fixed top-0 right-0 left-0 z-50 w-full h-16 border-b border-white/2 bg-transparent backdrop-blur-sm">
        <nav className="mx-auto flex  h-full items-center max-w-7xl justify-between px-4 sm:px-6 lg:px-8">
            <Link href="/">Build<span className="font-bold text-red-500">&lt;Ai/&gt;</span></Link>
            <div className="flex items-center gap-5">
                <Show when="signed-in">
                    <Link href={"/projects"} className="text-[13px] font-medium text-muted-foreground">Projects</Link>
                        <span className="inline-flex h-8 items-center rounded-md bg-white/5  px-2 py-1 text-xs font-medium text-muted-foreground">
                            <Zap className="inline mr-1 fill-red-500/70 stroke-0" size={16} />
                             3 / 40 credits
                        </span>
                    <UserButton />
                </Show>
                
                <Show when="signed-out">
                    <SignInButton mode="modal">
                        <Button variant="ghost" size="sm" className="text-[13px] font-medium text-muted-foreground">
                            Sign In
                        </Button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                        <Button size="sm" className="text-[13px] rounderd-full font-semibold text-red-600 active:scale-95 px-4 ">
                            Get Started
                            <ArrowRight className="h-3 w-3 opacity-60"/>
                        </Button>
              </SignUpButton>
            </Show>

            </div>
        </nav>
    </header>
  )
}

export default Header