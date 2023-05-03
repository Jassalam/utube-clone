
import prisma from "@/lib/prisma"
import { getUser, getVideos, getSubscribersCount, isSubscribed } from "@/lib/data"
import Videos from "../components/Videos"
import { useState } from "react"
import { amount } from "@/lib/config"
import LoadMore from "../components/LoadMore"
import Heading from "../components/Heading"
import SubscribedButton from "../components/SubscribedButton"
import { useSession } from "next-auth/react"
import { authOptions } from "../api/auth/[...nextauth]"
import { getServerSession } from "next-auth"
import Link from "next/link"

export default function Channel({ user, initialVideos, subscribers, subscribed }) {
    const [videos, setVideos] = useState(initialVideos)
    const [reachedEnd, setReachedEnd] = useState(initialVideos.length < amount)
    const { data: session, status } = useSession()

    const loading = status === 'loading'

    if (loading) {
        return null
    }

    if (!user) return <p className='text-center p-5'> Channel does not exist</p>
    return (
        <>
            <Heading />
            <div>
                <div className='flex justify-between'>
                    <div className='flex m-5'>
                        {user.image && (
                            <img
                                className='w-20 h-20 mt-2 mr-2 rounded-full'
                                src={user.image}
                            />
                        )}
                        <div className='mt-5'>
                            <p className='text-lg font-bold text-white'>{user.name}</p>
                            <div className=''>
                                <div className=''>
                                    <div className='text-gray-400'>{subscribers} subscribers</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='mt-12 mr-5'>
                        {session && user.id === session.user.id ? (
                            <>
                            <Link href={`/upload`} className='bg-green-500 px-3 py-2 rounded-full'>
                                Upload new video
                            </Link>
                            </>
                        ) : (
                            <SubscribedButton user={user} subscribed={subscribed}/>
                        )}
                    </div>
                </div>
                <div>
                    <Videos videos={videos} />
                    {!reachedEnd && (
                        <LoadMore
                            videos={videos}
                            setVideos={setVideos}
                            setReachedEnd={setReachedEnd}
                            author={user}
                        />
                    )}
                </div>
            </div>
        </>
    )
}

export async function getServerSideProps(context) {
    const session = await getServerSession(context.req, context.res, authOptions)

    let user = await getUser(context.params.username, prisma)
    user = JSON.parse(JSON.stringify(user))

    let videos = await getVideos({ author: user.id }, prisma)
    videos = JSON.parse(JSON.stringify(videos))

    const subscribers = await getSubscribersCount(context.params.username, prisma)

    let subscribed = null
    if(session){
        subscribed = await isSubscribed(session.user.username, user.id, prisma)
    }

    return {
        props: {
            initialVideos: videos,
            user,
            subscribers,
            subscribed,
        },
    }
}