"use client";

import { WagmiProvider } from "wagmi";
import { wagmiConfig } from "@/config/web3";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Providers } from "@/providers";
import { Nav } from "@/components/layout/Nav";
import "@/styles/globals.css";

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <WagmiProvider config={wagmiConfig}>
          <QueryClientProvider client={queryClient}>
            <Providers>
              <div className="relative flex min-h-screen flex-col">
                <Nav />
                <main className="flex-1">{children}</main>
              </div>
            </Providers>
          </QueryClientProvider>
        </WagmiProvider>
      </body>
    </html>
  );
}
