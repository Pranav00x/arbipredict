"use client";

import { useEffect } from "react";

export function FarcasterSDKInit() {
    useEffect(() => {
        const url = new URL(window.location.href);
        const isMiniApp =
            url.pathname.includes("/miniapp") ||
            url.searchParams.get("miniApp") === "true" ||
            window.parent !== window;

        if (isMiniApp) {
            import("@farcaster/miniapp-sdk").then(({ sdk }) => {
                sdk.actions.ready();
            }).catch(() => {
                // Not in a Farcaster context, ignore
            });
        }
    }, []);

    return null;
}
