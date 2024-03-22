import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const response = await fetch('https://api.github.com/users/mendableai/repos', {
            headers: {
                'Authorization': `Bearer ${process.env.GITHUB_API}`
            }
        });
        const data = await response.json();
        const ragArenaRepo = data.find((repo: { name: string; }) => repo.name === 'rag-arena');

        return NextResponse.json({
            stargazers_count: ragArenaRepo.stargazers_count,
            status: 200
        });
    } catch (error) {
        return NextResponse.json({
            stargazers_count: 0,
            status: 500
        });
    }
}

