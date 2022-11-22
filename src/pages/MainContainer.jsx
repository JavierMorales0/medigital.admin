import { Outlet } from 'react-router-dom'
import { NavBar } from '@/components/NavBar'
import { routes } from '@/helpers/routes'
import { useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import wave from '@/assets/wave.svg'

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
            style={{
              height: '200px',
              backgroundColor: 'var(--surface-100)',
              position: 'relative',
            }}
          >
            <p className='_bold m-0' style={{ fontSize: '40px' }}>
              {locationName}
            </p>
            <img
              src={wave}
              alt='wave'
              style={{
                position: 'absolute',
                right: 0,
                bottom: 0,
                transform: 'rotate(180deg)',
              }}
            />
          </div>
        ) : null}

        <div className='px-4 py-2'>
          <Outlet />
        </div>
      </main>
    </>
  )
}
