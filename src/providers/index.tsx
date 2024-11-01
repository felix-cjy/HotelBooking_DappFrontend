"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { useMounted } from "@/hooks/use-mounted";

export function Providers({ children }: { children: React.ReactNode }) {
  const mounted = useMounted();

  if (!mounted) {
    return null;
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
      <Toaster position="top-right" richColors />
    </ThemeProvider>
  );
}
