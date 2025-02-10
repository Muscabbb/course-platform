// import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <NavBar />
      {children}
    </>
  );
}

const NavBar = async () => {
  return (
    <header className="flex h-12 shadow bg-background z-10">
      <nav className="flex container gap-4 items-center">
        <Link href={"/"} className="mr-auto text-lg">
          Courser <Badge>Admin</Badge>
        </Link>
        <div className="flex gap-4 justify-between items-center">
          <Link href="/admin/courses">Courses</Link>
          <Link href="/admin/products">Products</Link>
          <Link href="/admin/sales">sales</Link>
          <div className="size-8 self-center">
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: { width: "100%", height: "100%" },
                },
              }}
            />
          </div>
        </div>
      </nav>
    </header>
  );
};
