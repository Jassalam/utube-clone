import { getVideos } from 'lib/data.js'
import { useState } from 'react'
import prisma from 'lib/prisma'
import Videos from './components/Videos'
import Heading from './components/Heading'
import LoadMore from './components/LoadMore'
import { amount } from '@/lib/config'

export default function Index({ initialVideos }) {
  const [videos, setVideos] = useState(initialVideos)
  const [reachedEnd, setReachedEnd] = useState(initialVideos.length < amount)

  return (
    <div>
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
        />
      )}
    </div>
  )
}

export async function getServerSideProps() {
  let videos = await getVideos({}, prisma)
	videos = JSON.parse(JSON.stringify(videos))

  return {
    props: {
      initialVideos: videos,
    },
  }
}