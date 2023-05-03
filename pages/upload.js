import { useState } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import Heading from './components/Heading'

const getVideoDuration = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const media = new Audio(reader.result)
      media.onloadedmetadata = () => resolve(media.duration)
    }
    reader.readAsDataURL(file)
    reader.onerror = (error) => reject(error)
  })
}

export default function Upload() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const loading = status === 'loading'

  const [title, setTitle] = useState('')
  const [image, setImage] = useState(null)
  const [video, setVideo] = useState(null)
  const [duration, setDuration] = useState(null)

  if (!session || !session.user) return null
  if (loading) return null

  return (
    <>
      <Heading />

      <form
        className='mt-10 ml-20  text-center'
        onSubmit={async (e) => {
          e.preventDefault()

          const body = new FormData()
          body.append('image', image)
          body.append('title', title)
          body.append('video', video)
          body.append('duration', duration)

          await fetch('/api/upload', {
            body,
            method: 'POST',
          })

          router.push(`/channel/${session.user.username}`)
        }}
      >
        <div className='flex-1 mb-5'>
          <div className='flex-1 mb-5'>Title</div>
          <input
            type='text'
            name='name'
            onChange={(e) => setTitle(e.target.value)}
            className='border p-1 text-black'
            required
          />
        </div>

        <div className='text-sm text-gray-600 '>
          <label className='relative font-medium cursor-pointer  my-3 block'>
            <p className=''>Video thumbnail {image && '✅'}</p> (800 x 450
            suggested)
            <input
              name='image'
              type='file'
              accept='image/*'
              className='hidden'
              required
              onChange={(event) => {
                if (event.target.files && event.target.files[0]) {
                  if (event.target.files[0].size > 3072000) {
                    alert('Maximum size allowed is 3MB')
                    return false
                  }
                  setImage(event.target.files[0])
                }
              }}
            />
          </label>
        </div>
        <div className='text-sm text-gray-600 '>
          <label className='relative font-medium cursor-pointer my-3 block'>
            <p className=''>Video file {video && '✅'}</p>
            <input
              name='image'
              type='file'
              accept='video/*'
              className='hidden'
              required
              onChange={async (event) => {
                if (event.target.files && event.target.files[0]) {
                  if (event.target.files[0].size > 20971520) {
                    alert('Maximum size allowed is 20MB')
                    return false
                  }
                  const duration = await getVideoDuration(event.target.files[0])
                  setDuration(parseInt(duration))
                  setVideo(event.target.files[0])
                }
              }}
            />
          </label>
        </div>
        <button
          disabled={title && video && image ? false : true}
          className={`border px-8 py-2 mt-0 font-bold rounded-full ${
            title && video && image
              ? ''
              : 'cursor-not-allowed text-gray-800 border-gray-800'
          }`}
        >
          Upload
        </button>
      </form>
    </>
  )
}