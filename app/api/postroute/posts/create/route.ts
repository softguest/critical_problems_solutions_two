import { PrismaClient } from '@prisma/client'
import { db } from '@/lib/db'
const prisma = new PrismaClient()

export async function createPost(title: string, content: string, userId: string) {
  try {
    const newPost = await db.post.create({
      data: {
        title,
        content,
        author: { connect: { id: userId } }
      }
    })
    return newPost
  } catch (error) {
    console.error('Failed to create post:', error)
    throw error
  }
}
