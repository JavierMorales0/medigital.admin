import { useState } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { mainRoutes, routes } from '@/helpers/routes.js'
import { AutoComplete } from 'primereact/autocomplete'
import '@/assets/css/Navbar.css'
import { Button } from 'primereact/button'

export const NavBar = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [search, setSearch] = useState('')
  const [openMenu, setOpenMenu] = useState(false)
  const [suggestions, setSuggestions] = useState(routes)
  /**
   * event to set the suggestions by the event.query param
   * @param {Object} event
   */
  const searchRoute = (event) => {
    const _suggestions = routes.filter((item) => {
      return item.matchWords.includes(event.query) ? item : null
    })
    setSuggestions(_suggestions)
  }
  /**
   * Function to go to the specific path
   * @param {Object} route
   */
  const goTo = (route) => {
    if (!route.url) {
      alert('Imposible')
    }
    navigate(route.url)
  }

  const handleLogOut = () => {
    localStorage.clear()
    navigate('/login')
  }

  return (
    <>
      <nav
        className='d-flex flex-row justify-content-between align-items-center px-5 py-3 w-100'
        style={{
          height: '100px',
          backgroundColor: 'var(--surface-0)',
        }}
      >
        <div className=''>
          <i
            className='pi pi-bars me-5'
            style={{ fontSize: '1.3em', cursor: 'pointer' }}
            onClick={() => setOpenMenu((current) => !current)}
          ></i>
          <span className=' _bold text-center' style={{ fontSize: '1.5em' }}>
            MEDIGITAL
            <span
              className='_boldest'
              style={{ fontSize: '.8rem', color: 'var(--primary-color)' }}
            >
              .admin
            </span>
          </span>
        </div>
        <div>
          <AutoComplete
            value={search}
            suggestions={suggestions}
            completeMethod={searchRoute}
            field='label'
            onChange={(e) => setSearch(e.value)}
            placeholder='Ingrese acci&oacute;n que desea realizar (ver, crear)'
            style={{ minWidth: '400px' }}
            onSelect={(e) => goTo(e.value)}
          />
        </div>
        {openMenu ? (
          <Menu
            setOpenMenu={setOpenMenu}
            pathname={pathname}
            handleLogOut={handleLogOut}
          />
        ) : null}
        <div
          className='d-flex flex-row align-items-center justify-content-around gap-2'
          style={{ minWidth: '450px' }}
        ></div>
      </nav>
    </>
  )
}

const Menu = ({ setOpenMenu, pathname, handleLogOut }) => {
  return (
    <article
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        width: '300px',
        zIndex: 2,
        backgroundColor: 'var(--surface-900)',
        color: 'var(--primary-color-text)',
      }}
      className='py-3 px-4'
    >
      <Button
        icon='pi pi-times'
        style={{
          fontSize: '1.3em',
          position: 'absolute',
          top: '10px',
          right: '10px',
        }}
        className='p-button-rounded '
        onClick={() => setOpenMenu((current) => !current)}
      />
      <p className='_bold m-0'>ADMIN</p>
      <p
        className=''
        style={{ fontSize: '.9rem', color: 'var(--primary-color)' }}
      >
        Bienvenido al portal
      </p>
      <hr />
      <div className='d-flex flex-column gap-2 w-100 container '>
        {mainRoutes.map((item) => {
          return (
            <Link
              key={item.label}
              to={item.url}
              className='my-2 '
              style={{
                textDecoration: pathname === item.url ? 'underline' : 'none',
                color:
                  pathname === item.url
                    ? 'var(--primary-color)'
                    : 'var(--color-text)',
              }}
              onClick={() => setOpenMenu((current) => !current)}
            >
              <i className={`${item.icon} me-3`}></i>
              <span className=''>{item.label}</span>
            </Link>
          )
        })}
      </div>
      <hr />
      <Button
        label='Cerrar sesi&oacute;n'
        icon='pi pi-sign-out '
        className='mx-auto d-block'
        onClick={handleLogOut}
      />
    </article>
  )
}
