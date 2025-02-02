import { Button } from "@/components/ui/button";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";
import React from "react";

export default function ConsumersLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <NavBar />
      {children}
    </>
  );
}

const NavBar = () => {
  return (
    <header className="flex h-12 shadow bg-background z-10">
      <nav className="flex container gap-4 items-center">
        <Link href={"/"} className="mr-auto text-lg px-4">
          Courser
        </Link>
        <div className="flex gap-4 justify-between items-center">
          <SignedIn>
            <Link href="/admin">Admin</Link>
            <Link href="/courses">My Courses</Link>
            <Link href="/purchases">Purchase History</Link>
            <div className="size-8 self-center">
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: { width: "100%", height: "100%" },
                  },
                }}
              />
            </div>
          </SignedIn>
          <SignedOut>
            <div className="flex items-center gap-4">
              <Button
                asChild
                variant={"link"}
                className="p-4 bg-blue-600 text-white hover:no-underline"
              >
                <SignUpButton />
              </Button>

              <Button
                asChild
                variant={"link"}
                className="p-4 bg-blue-600 text-white hover:no-underline"
              >
                <SignInButton />
              </Button>
            </div>
          </SignedOut>
        </div>
      </nav>
    </header>
  );
};
