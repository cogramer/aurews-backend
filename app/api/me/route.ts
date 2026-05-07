import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getUser } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const tokenUser = getUser(req)
  if (!tokenUser)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await db.user.findUnique({
    where: { id: tokenUser.id },
    select: { id: true, name: true, email: true, role: true, createdAt: true }
  })

  return NextResponse.json(user)
}