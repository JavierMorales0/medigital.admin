import '@/assets/css/Login.css'
import React from 'react'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Password } from 'primereact/password'

export const Login = () => {
  return (
    <>
      <form className='login'>
        <div className='text-center'>
            <h3 className='fw-light mb-3'>Bienvenido al panel de administraci&oacute;n</h3>
        </div>
        <div className='p-inputgroup mb-3'>
          <span className='p-inputgroup-addon'>
            <i className='pi pi-user'></i>
          </span>
          <InputText placeholder='Escriba su usuario' />
        </div>

        <div className='p-inputgroup mb-3'>
          <Password placeholder='Ingrese su contrase&ntilde;a' feedback={false} toggleMask/>
          <span className='p-inputgroup-addon'>
            <i className='pi pi-key'></i>
          </span>
        </div>
        <Button label='Login' icon='pi pi-angle-right' iconPos='right' className="p-button"/>
      </form>
    </>
  )
}