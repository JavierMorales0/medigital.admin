import '@/assets/css/Login.css'
import React from 'react'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Password } from 'primereact/password'
import { useState } from 'react'
import { login } from '@/api/endpoints'
import { ToastContainer, toast } from 'react-toastify'
import { Loader } from '@/components/Loader'
import { showNotification } from '@/helpers/notification'
import { useNavigate } from 'react-router-dom'

export const Login = () => {
  const navigate = useNavigate()
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const handleChangeUsername = (e) => {
    setCredentials((current) => {
      return { ...current, username: e.target.value }
    })
  }
  const handleChangePassword = (e) => {
    setCredentials((current) => {
      return { ...current, password: e.target.value }
    })
  }
  const handleLogin = (e) => {
    e.preventDefault()
    _login(credentials)
  }
  const _login = async (data) => {
    try {
      setLoading(true)
      const { credential } = await login(data)
      localStorage.setItem('medigital.admin:credential', credential)
      navigate('/', { replace: true })
    } catch (err) {
      showNotification(err.msg, 'error')
    } finally {
      setLoading(false)
    }
  }
  return (
    <>
      <ToastContainer /> {loading && <Loader />}
      <form className='login'>
        <div className='text-center'>
          <h3 className='fw-light mb-3'>
            Bienvenido al panel de administraci&oacute;n
          </h3>
        </div>
        <div className='p-inputgroup mb-3'>
          <span className='p-inputgroup-addon'>
            <i className='pi pi-user'></i>
          </span>
          <InputText
            placeholder='Escriba su usuario'
            value={credentials.username}
            onChange={handleChangeUsername}
          />
        </div>

        <div className='p-inputgroup mb-3'>
          <Password
            placeholder='Ingrese su contrase&ntilde;a'
            feedback={false}
            toggleMask
            value={credentials.password}
            onChange={handleChangePassword}
          />
          <span className='p-inputgroup-addon'>
            <i className='pi pi-key'></i>
          </span>
        </div>
        <Button
          label='Iniciar sesi&oacute;n'
          icon='pi pi-angle-right'
          iconPos='right'
          className='p-button'
          onClick={handleLogin}
        />
      </form>
    </>
  )
}
