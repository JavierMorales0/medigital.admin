import { Outlet } from 'react-router-dom'
import { NavBar } from '@/components/NavBar'
import { routes } from '@/helpers/routes'
import { useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'

export const MainContainer = () => {
  const { pathname } = useLocation()
  const [locationName, setLocationName] = useState(document.title)
  useEffect(() => {
    const route = routes.find((item) => item.url === pathname)
    setLocationName(route?.label)
  }, [pathname])
  return (
    <>
      <NavBar />
      <main className=''>
        {pathname === '/' ||
        pathname === '/consulta' ||
        pathname === '/expediente' ||
        pathname === '/medicamentos' ? (
          <div
            className='d-flex align-items-center justify-content-start ps-5'
            style={{ height: '200px', backgroundColor: 'var(--surface-200)' }}
          >
            <p className='_bold m-0' style={{ fontSize: '40px' }}>
              {' '}
              {locationName}
            </p>
          </div>
        ) : null}

        <Outlet />
      </main>
    </>
  )
}
