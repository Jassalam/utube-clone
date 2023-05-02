import prisma from "@/lib/prisma"
import { faker } from '@faker-js/faker'

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.end()

    if (req.body.task === 'generate_content') {
        let usersCount = 0

        while (usersCount < 10) {
            await prisma.user.create({
                data: {
                    name: faker.name.fullName(),
                    username: faker.internet.userName().toLowerCase(),
                    email: faker.internet.email().toLowerCase(),
                    image: faker.image.avatar(),
                },
            })
            usersCount++
        }
        const videoURL = 'https://bootcamp-jassalam.fra1.digitaloceanspaces.com/levi-arnold-IsKdeeEeyUQ-unsplash.jpg'
        const thumbnailURL = 'https://bootcamp-jassalam.fra1.digitaloceanspaces.com/SampleVideo_720x480_5mb.mp4'

        const users = await prisma.user.findMany()

        const getRandomUser = () => {
            const randomIndex = Math.floor(Math.random() * users.length)
            return users[randomIndex]
        }

        //create 20 videos, randomly assigned to users
        let videosCount = 0

        while (videosCount < 20) {
            await prisma.video.create({
                data: {
                    title: faker.lorem.words(),
                    thumbnail: thumbnailURL,
                    url: videoURL,
                    length: faker.datatype.number(1000),
                    visibility: 'public',
                    views: faker.datatype.number(1000),
                    author: {
                        connect: { id: getRandomUser().id },
                    },
                },
            })
            videosCount++
        }
    }

    if (req.body.task === 'clean_database') {
        await prisma.user.deleteMany({})
    }

    res.end()
}