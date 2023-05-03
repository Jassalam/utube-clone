import prisma from './prisma'
import { amount } from './config'

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

    if(options.author){
      data.where ={
        author: {
          id: options.author,
        },
      }
    }


    data.take = options.take || amount
    if(options.skip) data.skip = options.skip
  
    const videos = await prisma.video.findMany(data)
  
    return videos
  }

  export const getVideo = async (id, prisma) =>{
    const video = await prisma.video.findUnique({
      where: {
        id,
      },
      include: {
        author: true,
      },
    })

    return video
  }

  export const getUser = async ( username, prisma)=> {
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    })

    return user
  }

  export const getSubscribersCount = async (username, prisma) => {
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
      include: {
        subscribers: true,
      },
    })
  
    return user.subscribers.length
  }

  export const isSubscribed = async (username, isSubscribedTo, prisma) => {
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
      include: {
        subscribedTo: {
          where: {
            id: isSubscribedTo,
          },
        },
      },
    })
  
    return user.subscribedTo.length === 0 ? false : true
  }