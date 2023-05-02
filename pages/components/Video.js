import Image from 'next/image'
import timeago from '@/lib/timeago'
import Link from 'next/link'

export default function Video({ video }) {
  return (
    <div className=''>
      <div className='px-5 pb-5'>
        {video.thumbnail && (
          <Link href={`/video/${video.id}`}>
          <Image
            className='mb-2 cursor-pointer'
            src={video.thumbnail}
            width='800'
            height='450'
          />
          </Link>
        )}
        <p className='text-white float-right relative -mt-11 mr-1 bg-black p-1'>
          {Math.floor(video.length / 60)
          .toString()
          .padStart(2, '0')}
          : {(video.length %60).toString().padStart(2, '0')}
        </p>

        <div className='flex'>
          {video.author.image && (
            <img 
            className='w-10 h-10 mt-2 mr-2 rounded-full'
            src={video.author.image}
            />
          )}
        </div>

        
        <Link href={`/video/${video.id}`} className='text-lg font-bold text-white'>
          {video.title}
          </Link>
        <div className=''>
          <div className=''>
            <div className='text-gray-400'>
              <Link 
              href={`/channel/${video.author.username}`}
              className='mr-2 underline cursor-pointer'>
                {video.author.name}
              </Link>
              * {video.views} views *{' '}
                  {timeago.format(new Date(video.createdAt))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}