import prisma from "@/lib/prisma";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(501).end()
    }
  
    await prisma.video.update({
      where: { id: req.body.video },
      data: {
        views: {
          increment: 1,
        },
      },
    })
  
    res.end()
  }