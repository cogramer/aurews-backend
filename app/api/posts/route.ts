import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getUser } from '@/lib/auth'
import meiliClient from '@/lib/meilisearch'

export async function GET(req: NextRequest) {
  try {
    // 1. Get the query parameters from the URL
    const searchParams = req.nextUrl.searchParams
    const categorySlug = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '10') // Default to 10
    const page = parseInt(searchParams.get('page') || '1')    // Default to page 1

    // 2. Build the query conditions
    const whereCondition = categorySlug ? { category: { slug: categorySlug } } : {}
    const skip = (page - 1) * limit

    // 3. Fetch the posts AND the total count at the same time
    const [posts, totalCount] = await Promise.all([
      db.post.findMany({
        where: whereCondition,
        include: {
          category: true,
          author: { select: { id: true, name: true, role: true } }
        },
        orderBy: { createdAt: 'desc' },
        skip: skip,
        take: limit,
      }),
      db.post.count({ where: whereCondition })
    ])

    // 4. Calculate if there are more posts to load
    const hasMore = skip + posts.length < totalCount

    // 5. Return the posts and the pagination data
    return NextResponse.json({
      data: posts,
      meta: {
        total: totalCount,
        page,
        limit,
        hasMore
      }
    })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    // 1. check if logged in
    const tokenUser = getUser(req)
    if (!tokenUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. validate body
    const body = await req.json()
    const { title, slug, content, metaDescription, thumbnail, categoryId, status = 'DRAFT' } = body

    if (!title || !slug || !content || !categoryId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // 3. create post
    const post = await db.post.create({
      data: {
        title,
        slug,
        content,
        metaDescription,
        thumbnail,
        categoryId: Number(categoryId),
        authorId: tokenUser.id,
        status: status
      },
      include: {
        category: true,
        author: { select: { id: true, name: true } }
      }
    })
    try {
      await meiliClient.index('posts').addDocuments([{
        id: post.id,
        title: post.title,
        slug: post.slug,
        category: post.category.name,
        author: post.author.name,
        excerpt: post.content.substring(0, 200),
        status: post.status,
        thumbnail: post.thumbnail,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt
      }]);
    } catch (err) {
      console.error('Meilisearch sync Error: ', err)
    }
    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}


