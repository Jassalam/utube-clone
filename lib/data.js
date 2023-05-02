export const getVideos = async (options, prisma) => {
    const data = {
      where: {},
      orderBy: [
        {
          createdAt: 'desc',
        },
      ],
      include: {
        author: true,
      },
    }
  
    const videos = await prisma.video.findMany(data)
  
    return videos
  }