import type { ReactNode } from "react";

/**
 * Admin console layout.
 *
 * Scopes JetBrains Mono (loaded in the root layout, mapped to `font-mono` in
 * globals.css) to every route under `/admin` — so the whole admin console is
 * monospaced while the public site keeps Inter.
 *
 * `display: contents` makes this wrapper invisible to layout: its children stay
 * direct flex children of <body> exactly as before, but still inherit the
 * monospaced font-family from it.
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="font-mono" style={{ display: "contents" }}>
      {children}
    </div>
  );
}
