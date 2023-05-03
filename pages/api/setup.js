import middleware from 'middleware/middleware'
import nextConnect from 'next-connect'

import prisma from '@/lib/prisma'
import { authOptions } from './auth/[...nextauth]'
import { getServerSession } from 'next-auth'
import { upload } from 'lib/upload'

 

const handler = nextConnect()
handler.use(middleware)

handler.post(async (req, res) => {
    const session = await getServerSession(req, res, authOptions)
    if (!session) return res.status(401).json({ message: 'Not logged in' })
  
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
    })
  
    if (!user) return res.status(401).json({ message: 'User not found' })
  
    await prisma.user.update({
      where: { id: user.id },
      data: {
        name: req.body.name[0],
        username: req.body.username[0],
      },
    })
  
    if (req.files && req.files.image[0]) {
          const avatar_url = await upload(
        req.files.image[0].path,
        req.files.image[0].originalFilename,
        user.id
      )
      await prisma.user.update({
        where: { id: user.id },
        data: {
          image: avatar_url,
        },
      })
    }

  res.end()
  return
})

export const config = {
  api: {
    bodyParser: false,
  },
}

export default handler