import { db } from '@/lib/db'
export async function askQuestion(content: string, postId: string, userId: string) {
  try {
    const newQuestion = await db.question.create({
      data: {
        content,
        post: { connect: { id: postId } },
        user: { connect: { id: userId } }
      }
    })
    return newQuestion
  } catch (error) {
    console.error('Failed to create question:', error)
    throw error
  }
}
