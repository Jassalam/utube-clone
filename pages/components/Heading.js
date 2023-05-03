import Link from 'next/link'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'

export default function Heading() {
  const router = useRouter()
  const { data: session, status} = useSession()
  const loading = status === 'loading'

  if(loading){
    return null
  }

  return (
    <header className='h-14 flex pt-5 px-5 pb-2'>
      <div className='text-xl'>
        {router.asPath === '/' ? (
          <p>YouTube clone</p>
        ) : (
          <Link href={`/`} className='underline'>
						Home
          </Link>
        )}
      </div>

      <div className='grow ml-10 -mt-1'></div>
      <a 
      className='flex-l border px-4 font-bold rounded-full'
      href={session ? '/api/auth/signout' : '/api/auth/signin'}
      >
        {session ? 'logout' : 'login'}
      </a>
    </header>
  )
}