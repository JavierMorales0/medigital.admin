import { Outlet } from 'react-router-dom'
import { NavBar } from '@/components/NavBar'

export const MainContainer = () => {
  return (
    <>
      <NavBar />
      <main className='px-2 px-md-3 py-1 py-md-2'>
        <Outlet />
      </main>
    </>
  )
}
