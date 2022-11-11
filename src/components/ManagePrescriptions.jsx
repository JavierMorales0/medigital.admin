import { memo, useState, useEffect } from 'react'
import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import { ToastContainer, toast } from 'react-toastify'
import { getPrescriptionsByIdConsult } from '@/api/endpoints'

const ManagePrescriptions = ({ _id }) => {
  const [prescriptions, setPrescriptions] = useState([])
  const [display, setDisplay] = useState(false)
  useEffect(() => {
    const controller = new AbortController()
    const _getPrescriptionsByIdConsult = async () => {
      try {
        const response = await getPrescriptionsByIdConsult(
          _id,
          controller.signal
        )
        console.log(response)
        setPrescriptions(response)
      } catch (err) {
        showNotification(err.msg, 'error')
      }
    }
    _getPrescriptionsByIdConsult()

    return () => {
      controller.abort
    }
  }, [])

  return (
    <>
      <ToastContainer />
      <Button
        label='Administrar prescripciones'
        icon='pi pi-external-link'
        onClick={() => setDisplay(true)}
      />

      <Dialog
        header='Administrar prescripciones'
        visible={display}
        style={{ width: '50vw' }}
        onHide={() => setDisplay(false)}
      >
        <section style={{ minHeight: '300px' }}>
          <div className='w-100'>
            <p className=''>Listado de prescripciones de la consulta</p>
            <article>
              {prescriptions.map((item) => {
                return (
                  <>
                    <p className='m-0'>Prescripci&oacute;n #{item._id}</p>
                    <ul>
                      {item.details.map((element) => {
                        return (
                          <li key={element._id} className='m-0'>
                            <p className='_bold m-0'>{element.medicine.name}</p>
                            <p className='m-0 ' style={{ fontSize: '0.9rem' }}>
                              {element.quantity} unidad(es)
                            </p>
                            <p className='text-muted m-0'>
                              dosis: {element.dose}
                            </p>
                          </li>
                        )
                      })}
                    </ul>
                  </>
                )
              })}
            </article>
          </div>
        </section>
      </Dialog>
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

export default memo(ManagePrescriptions)
