import { memo, useState, useEffect } from 'react'
import { Dropdown } from 'primereact/dropdown'
import { InputNumber } from 'primereact/inputnumber'
import { Button } from 'primereact/button'
import { ToastContainer, toast } from 'react-toastify'
import { useCallback } from 'react'
import { createMovement } from '@/api/endpoints'
import { InputTextarea } from 'primereact/inputtextarea'

const movementTypes = [
  {
    value: 'IN',
    label: 'CARGA',
  },
  {
    value: 'OUT',
    label: 'DESCARGA',
  },
  {
    value: 'ADJUST-IN',
    label: 'AJUSTE DE CARGA',
  },
  {
    value: 'ADJUST-OUT',
    label: 'AJUSTE DE DESCARGA',
  },
]

const RegisterMovement = ({ medicines, whenChanges }) => {
  const [movement, setMovement] = useState({})

  const registerMovement = async () => {
    const isValid = validateData(movement)
    if (!isValid.status) {
      showNotification(isValid.msg, 'warning')
    }
    const _movement = movement
    // CHANGE PARAM ADJUST IN TYPE
    if (_movement.type.includes('ADJUST-')) {
      _movement.type = _movement.type?.replace('ADJUST-', '')
    }
    console.log(_movement)
    try {
      await createMovement(movement)
      setMovement({})
    } catch (err) {
      showNotification(err.msg, 'error')
    } finally {
      whenChanges()
    }
  }

  const validateData = useCallback((data) => {
    if (!data?.type) {
      return { msg: 'El tipo de movimiento no es correcto', status: false }
    }
    if (!data.quantity || data.quantity <= 0) {
      return { msg: 'La cantidad debe ser mayor a 0', status: false }
    }
    if (!data.medicine || data.medicine.length !== 24) {
      return { msg: 'El ID de medicina es incorrecto', status: false }
    }

    return { msg: '', status: true }
  }, [])

  const handleType = (e) => {
    if (e.value === 'ADJUST-IN' || e.value === 'ADJUST-OUT') {
      setMovement((current) => {
        return { ...current, observations: '!AJUSTE' }
      })
    } else {
      setMovement((current) => {
        return {
          ...current,
          observations: current.observations?.replace('!AJUSTE', ''),
        }
      })
    }
    //const type = e.value === 'ADJUST-IN' ? 'IN' : 'ADJUST-OUT' ? 'OUT' : e.value
    setMovement((current) => {
      return { ...current, type: e.value }
    })
  }

  return (
    <>
      <ToastContainer />
      <div className='row '>
        <div className='col-7 my-1'>
          <p className='m-0'>Tipo de movimiento:</p>
          <Dropdown
            optionLabel='label'
            optionValue='value'
            className='w-100'
            value={movement?.type}
            options={movementTypes}
            onChange={handleType}
            placeholder='Seleccione el tipo de movimiento'
          />
          <p
            className='text-muted m-0'
            style={{ fontSize: '.8rem', textAlign: 'justify' }}
          >
            Para crear un "ajuste de inventario" se debe seleccionar el tipo de
            ajuste y automaticamente se insertar&aacute; la bandera de "AJUSTE"
            en observaciones
          </p>
        </div>
        <div className='col-5 my-1'>
          <p className='m-0'>Cantidad:</p>
          <InputNumber
            value={movement?.quantity}
            className='w-100'
            min={1}
            placeholder='Ingrese la cantidad'
            onValueChange={(e) =>
              setMovement((current) => {
                return { ...current, quantity: e.value }
              })
            }
          />
          <p
            className='text-muted m-0'
            style={{ fontSize: '.8rem', textAlign: 'justify' }}
          >
            Debe ser un n&uacute;mero mayor a cero
          </p>
        </div>
        <div className='col-12 my-1'>
          <p className='m-0'>Medicamento:</p>
          <Dropdown
            optionLabel='name'
            optionValue='_id'
            className='w-100'
            value={movement?.medicine}
            options={medicines}
            onChange={(e) =>
              setMovement((current) => {
                return { ...current, medicine: e.value }
              })
            }
            placeholder='Seleccione un medicamento'
          />
        </div>
        <div className='col-12 my-1'>
          <p>Observaciones</p>
          <InputTextarea
            value={movement?.observations}
            rows={2}
            className='w-100'
            placeholder='Ingrese las observaciones'
            onChange={(e) =>
              setMovement((current) => {
                return { ...current, observations: e.target.value }
              })
            }
          />
        </div>
      </div>
      <Button
        label='Registrar movimiento'
        className={` my-1 d-block mx-auto`}
        onClick={registerMovement}
      />
    </>
  )
}

const showNotification = (msg, status) => {
  const options = {
    position: 'top-right',
    autoClose: 2000,
    hideProgressBar: true,
    theme: 'light',
  }
  switch (status) {
    case 'success':
      return toast.success(msg, options)
    case 'warning':
      return toast.warn(msg, options)
    case 'error':
      return toast.error(msg, options)
    default:
      return toast.info(msg, options)
  }
}

export default memo(RegisterMovement)
