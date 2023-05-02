import { getVideos } from 'lib/data.js'
import prisma from 'lib/prisma'
import Videos from './components/Videos'
import Heading from './components/Heading'

export default function Index({ videos }) {
  return (
    <div>
      <Heading />

      {videos.length === 0 && (
        <p className='flex justify-center mt-20'>No videos found!</p>
      )}
      <Videos videos={videos} />
    </div>
  )
}

export async function getServerSideProps() {
  let videos = await getVideos({}, prisma)
	videos = JSON.parse(JSON.stringify(videos))

  return {
    props: {
      videos,
    },
  }
}