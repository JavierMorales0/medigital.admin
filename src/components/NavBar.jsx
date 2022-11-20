import { useState } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { mainRoutes, routes } from '@/helpers/routes.js'
import { AutoComplete } from 'primereact/autocomplete'
import '@/assets/css/Navbar.css'

export const NavBar = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [search, setSearch] = useState('')
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
  return (
    <>
      <nav
        className='d-flex flex-row justify-content-between align-items-center px-5 py-3 w-100'
        style={{
          minHeight: '80px',
          maxHeight: '100px',
          backgroundColor: 'var(--surface-100)',
        }}
      >
        <div className=''>
          <span className=' _bold text-center'>
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
        <div
          className='d-flex flex-row align-items-center justify-content-around gap-2'
          style={{ minWidth: '450px' }}
        >
          {mainRoutes.map((item) => {
            return (
              <Link
                key={item.label}
                to={item.url}
                className='m-0 '
                style={{
                  textDecoration: pathname === item.url ? 'underline' : 'none',
                  color:
                    pathname === item.url
                      ? 'var(--primary-color)'
                      : 'var(--color-text)',
                }}
              >
                {item.label}
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
