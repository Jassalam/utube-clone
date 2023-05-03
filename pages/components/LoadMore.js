import { amount } from 'lib/config'

export default function LoadMore({videos, setVideos, setReachedEnd, author, subscriptions}) {
  return (
    <div className='flex justify-center'>
      <button
        className='border px-8 py-2 my-10 mr-2 font-bold rounded-full'
				onClick={async () => {
          let url = `/api/videos?skip=${videos.length}`

          if(author){
            url += `&author=${author.id}`
          }

          if(subscriptions){
            url += `/&subscriptions=${subscriptions}`
          }
          const res = await fetch(url)
          const data = await res.json()
          if (data.length < amount) {
            setReachedEnd(true)
          }
          setVideos([...videos, ...data])
        }}      
      >
        Load more
      </button>
    </div>
  )
}