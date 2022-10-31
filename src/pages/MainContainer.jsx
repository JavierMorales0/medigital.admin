import { Outlet } from 'react-router-dom'
import { NavBar } from '@/components/NavBar'

export const MainContainer = () => {
  return (
    <>
      <NavBar />
      <main style={{ marginLeft: '100px' }}>
        <Outlet />
      </main>
    </>
  )
}
