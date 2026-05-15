import type { Metadata } from "next";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  UserButton,
  Show,
} from "@clerk/nextjs";

import "./globals.css";

export const metadata: Metadata = {
  title: "VR Living Studio",
description: "Premium Furniture & Living Experience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider>
          <header className="flex items-center justify-between border-b p-4">
            <h1 className="font-bold">
              VR Living Studio
            </h1>

            <div className="flex items-center gap-4">
              <Show when="signed-out">
                <SignInButton />
                <SignUpButton />
              </Show>

              <Show when="signed-in">
                <UserButton />
              </Show>
            </div>
          </header>

          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}