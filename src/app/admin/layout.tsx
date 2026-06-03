import type { ReactNode } from "react";

/**
 * Admin console layout.
 *
 * Scopes the "Editorial Coast" body typeface (Hanken Grotesk, loaded in the
 * root layout and mapped to `font-sans`) and ink text colour to every route
 * under `/admin`, while the public site keeps Inter. Headings opt into the
 * Fraunces display serif via `font-display`.
 *
 * `display: contents` keeps this wrapper invisible to layout — children remain
 * direct flex children of <body> — while still inheriting the font + colour.
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="font-sans text-ink" style={{ display: "contents" }}>
      {children}
    </div>
  );
}
