import type { HeadersFunction, LinksFunction, MetaFunction } from "@remix-run/node";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";

// With Remix + Vite, global CSS should be imported for its side effects.
// Do not pass the CSS content as a link href (that caused the router to try to navigate
// to the CSS text and produced errors like "No route matches URL '/*, ::before, ::after { ... }'").
import "./tailwind.css";

// No explicit CSS link needed; Vite injects the stylesheet for imported CSS files.
export const links: LinksFunction = () => [];

export const meta: MetaFunction = () => [
    { charset: "utf-8" },
    { title: "Builder Remix App" },
    { viewport: "width=device-width,initial-scale=1" },
];

// Force COOP/COEP on the document response to enable SharedArrayBuffer
export const headers: HeadersFunction = () => {
    return {
        "Cross-Origin-Opener-Policy": "same-origin",
        // credentialless is the most compatible during dev with Vite/reload assets
        "Cross-Origin-Embedder-Policy": "credentialless",
        "Origin-Agent-Cluster": "?1",
    };
};

export default function App() {
    return (
        <html lang="en">
            <head>
                <Meta />
                <Links />
            </head>
            <body>
                <Outlet />
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}
