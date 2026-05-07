import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { signToken } from '@/lib/jwt'

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()

  if (!email || !password)
    return NextResponse.json({ error: 'All fields required' }, { status: 400 })

  const user = await db.user.findUnique({ where: { email } })
  if (!user)
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

  const valid = await bcrypt.compare(password, user.password)
  if (!valid)
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

  const token = signToken({ id: user.id, role: user.role })
  return NextResponse.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role }
  })
}