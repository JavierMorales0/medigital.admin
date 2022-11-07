import { useContext, useEffect, useState } from 'react'
import { ConsultContext } from '@/pages/consults/Overview'
import { updateConsult } from '@/api/endpoints'
import { Loader } from '@/components/Loader'
import { Button } from 'primereact/button'
import { ToastContainer, toast } from 'react-toastify'
import moment from 'moment'

export const Doing = () => {
  const { selectedConsult, setSelectedConsult } = useContext(ConsultContext)
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    if (!selectedConsult) {
      const _consult = JSON.parse(
        localStorage.getItem('medigital.admin:current_consult')
      )
      setSelectedConsult(_consult)
    }
  }, [])

  const finishConsult = () => {
    const consult = prepareConsultData(selectedConsult)
    _updateConsult(consult)
    localStorage.removeItem('medigital.admin:current_consult')
    setSelectedConsult(null)
  }

  const _updateConsult = async (consult) => {
    try {
      setLoading(true)
      await updateConsult(consult)
    } catch (err) {
      showNotification(err.msg, 'error')
    } finally {
      setLoading(false)
    }
  }
  const prepareConsultData = (consult) => {
    return {
      ...consult,
      doctor: consult.doctor._id,
      patient: consult.patient._id,
      date: consult.date.slice(0, 10),
      status: 'FINISHED',
      end_hour: moment().format('hh:mm'),
    }
  }

  return selectedConsult !== null ? (
    <>
      <ToastContainer />
      {loading && <Loader />}
      <div>
        <h5>ID: {selectedConsult._id}</h5>
        <hr />
        <p>
          Paciente:{' '}
          {`${selectedConsult.patient.first_name} ${selectedConsult.patient.last_name}`}
        </p>
        <p>
          Doctor:{' '}
          {`${selectedConsult.doctor.employee.first_name} ${selectedConsult.doctor.employee.last_name}`}
        </p>
        <Button label='Finalizar consulta' onClick={finishConsult} />
      </div>
    </>
  ) : null
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
