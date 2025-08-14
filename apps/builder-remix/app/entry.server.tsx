import type { AppLoadContext, EntryContext } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import { isbot } from "isbot";
import { PassThrough } from "node:stream";
import { renderToPipeableStream } from "react-dom/server";

const ABORT_DELAY = 5_000;

export default function handleRequest(
    request: Request,
    responseStatusCode: number,
    responseHeaders: Headers,
    remixContext: EntryContext,
    loadContext: AppLoadContext
) {
    return isbot(request.headers.get("user-agent"))
        ? handleBotRequest(
            request,
            responseStatusCode,
            responseHeaders,
            remixContext
        )
        : handleBrowserRequest(
            request,
            responseStatusCode,
            responseHeaders,
            remixContext
        );
}

function handleBotRequest(
    request: Request,
    responseStatusCode: number,
    responseHeaders: Headers,
    remixContext: EntryContext
) {
    return new Promise((resolve, reject) => {
        let didError = false;

        const { pipe, abort } = renderToPipeableStream(
            <RemixServer context={remixContext} url={request.url} />,
            {
                onAllReady() {
                    const body = new PassThrough();
                    const headers = new Headers(responseHeaders);
                    headers.set("Content-Type", "text/html");
                    resolve(new Response(body as any, { status: didError ? 500 : responseStatusCode, headers }));
                    pipe(body);
                },
                onShellError(error: unknown) {
                    reject(error);
                },
                onError(error: unknown) {
                    didError = true;
                    console.error(error);
                },
            }
        );
        setTimeout(abort, ABORT_DELAY);
    });
}

function handleBrowserRequest(
    request: Request,
    responseStatusCode: number,
    responseHeaders: Headers,
    remixContext: EntryContext
) {
    return new Promise((resolve, reject) => {
        let didError = false;

        const { pipe, abort } = renderToPipeableStream(
            <RemixServer context={remixContext} url={request.url} />,
            {
                onShellReady() {
                    const body = new PassThrough();
                    const headers = new Headers(responseHeaders);
                    headers.set("Content-Type", "text/html");
                    resolve(new Response(body as any, { status: didError ? 500 : responseStatusCode, headers }));
                    pipe(body);
                },
                onShellError(err: unknown) {
                    reject(err);
                },
                onError(error: unknown) {
                    didError = true;
                    console.error(error);
                },
            }
        );
        setTimeout(abort, ABORT_DELAY);
    });
}


