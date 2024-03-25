import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";

export async function checkRateLimit(req: NextRequest, identifier: string) {
    if (process.env.PRODUCTION === "true") {
        const redis = new Redis({
            url: process.env.UPSTASH_REDIS_REST_URL!,
            token: process.env.UPSTASH_REDIS_REST_TOKEN!,
        });
        const ratelimit = new Ratelimit({
            redis: redis,
            limiter: Ratelimit.fixedWindow(50, "180 m"),
        });
        const result = await ratelimit.limit(identifier);
        if (!result.success) {
            return NextResponse.json({ error: 'Rate limit achieved' }, { status: 429 });
        }
    }
}