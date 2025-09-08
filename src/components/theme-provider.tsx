"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
// The problematic import has been removed.

// We now get the props type directly from the provider component itself.
// This is a much more stable and modern approach.
type ThemeProviderProps = React.ComponentProps<typeof NextThemesProvider>;

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
