import { NextRequest } from "next/server";

export function getClientIp(req: NextRequest) {
    return req.headers.get('x-real-ip') ?? req.headers.get('x-forwarded-for') ?? req.ip;
}