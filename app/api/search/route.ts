import { NextRequest, NextResponse } from "next/server";
import meiliClient from "@/lib/meilisearch";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const q = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');

    if (!q) return NextResponse.json({ message: 'Please provide a search query' }, { status: 400 });

    try {
        const filterStr = ['status="PUBLISHED"'];

        if (category) filterStr.push(`category="${category}"`);

        const searchResult = await meiliClient.index('posts').search(q, {
            limit: limit,
            filter: filterStr,
            attributesToHighlight: ['excerpt'],
            highlightPreTag: '<mark>',
            highlightPostTag: '</mark>',

        });
        return NextResponse.json(searchResult);
    } catch (error) {
        console.log("Meilisearch Error: ", error);
        return NextResponse.json({ message: 'Something went wrong while searching' }, { status: 500 });
    }
}