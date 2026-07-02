"use client";

import { PostHogProvider, usePostHog } from 'posthog-js/react';
import { useEffect } from 'react';

export function Instrumentation({ children }: { children: React.ReactNode }) {
    const posthog = usePostHog();

    useEffect(() => {
        if (posthog) {
            posthog.init(process.env.NEXT_PUBLIC_POSTHOG_TOKEN, {
                api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
                loaded: (ph) => {
                    console.log('PostHog successfully loaded', ph);
                },
            });
        }
    }, [posthog]);

    return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
