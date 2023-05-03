import { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { authOptions } from "./api/auth/[...nextauth]";
import { getServerSession } from "next-auth";

import prisma from "@/lib/prisma";
import { getVideos } from "@/lib/data";
import { amount } from "@/lib/config";
import Videos from "./components/Videos";
import LoadMore from "./components/LoadMore";
import Heading from "./components/Heading";

export default function Subscriptions({ initialVideos }) {
    const { data: session, status } = useSession()
    const router = useRouter()
  
    const [videos, setVideos] = useState(initialVideos)
    const [reachedEnd, setReachedEnd] = useState(initialVideos.length < amount)
  
    const loading = status === 'loading'
  
    if (loading) {
      return null
    }
  
    if (session && !session.user.name) {
      router.push('/setup')
    }
  
    return (
      <div>
        <Head>
          <title>YouTube Clone</title>
          <meta name='description' content='A great YouTube Clone' />
          <link rel='icon' href='/favicon.ico' />
        </Head>
        <Heading />
              
              {videos.length === 0 && (
          <p className='flex justify-center mt-20'>No videos found!</p>
        )}
  
        <Videos videos={videos} />
  
        {!reachedEnd && (
          <LoadMore
            videos={videos}
            setVideos={setVideos}
            setReachedEnd={setReachedEnd}
            subscriptions={session.user.id}
          />
        )}
      </div>
    )
  }
  
  export async function getServerSideProps(context) {
    const session = await getServerSession(context.req, context.res, authOptions)
  
      let videos = await getVideos({ subscriptions: session.user.id }, prisma) 
      videos = JSON.parse(JSON.stringify(videos))
  
    return {
      props: {
        initialVideos: videos,
      },
    }
  }