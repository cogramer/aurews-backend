import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { signToken } from '@/lib/jwt'

export async function POST(req: NextRequest) {
  const { email, password, name } = await req.json()

  // basic validation
  if (!email || !password || !name)
    return NextResponse.json({ error: 'All fields required' }, { status: 400 })

  // check if email already exists
  const exists = await db.user.findUnique({ where: { email } })
  if (exists)
    return NextResponse.json({ error: 'Email already in use' }, { status: 400 })

  // hash password then save
  const hashed = await bcrypt.hash(password, 10)
  const user = await db.user.create({
    data: { email, password: hashed, name, role: 'USER' }
  })

  const token = signToken({ id: user.id, role: user.role })
  return NextResponse.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role }
  }, { status: 201 })
}