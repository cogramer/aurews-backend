import { NextRequest } from 'next/server'
import { verifyToken } from './jwt'

// Gets the logged-in user from the request header, or null if not logged in
export function getUser(req: NextRequest) {
  const auth = req.headers.get('Authorization')
  if (!auth?.startsWith('Bearer ')) return null
  return verifyToken(auth.slice(7))
}