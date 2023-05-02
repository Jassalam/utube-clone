import { getVideos } from 'lib/data.js'
import prisma from 'lib/prisma'
import Videos from './components/Videos'

export default function Index({ videos }) {
  return (
    <div>
      <header className='h-14 flex pt-5 px-5 pb-2'>
        <div className='text-xl'>
          <p>YouTube clone</p>
        </div>

        <div className='grow'></div>
      </header>

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