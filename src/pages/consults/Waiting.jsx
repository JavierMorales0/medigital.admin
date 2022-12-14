import { useEffect, useState, useContext } from 'react'
import { getWaitingConsults, updateConsult } from '@/api/endpoints'
import { Loader } from '@/components/Loader'
import { ToastContainer, toast } from 'react-toastify'
import { ConsultContext } from '@/pages/consults/Overview'
import { DetailWaitingConsult } from '@/components/DetailWaitingConsult'
import moment from 'moment'

export const Waiting = () => {
  const [waitingConsults, setWaitingConsults] = useState([])
  const [loading, setLoading] = useState(false)

  const { selectedConsult, setSelectedConsult } = useContext(ConsultContext)
  useEffect(() => {
    const controller = new AbortController()
    const _getWaitingConsults = async () => {
      try {
        setLoading(true)
        const response = await getWaitingConsults(controller.signal)
        setWaitingConsults(response)
      } catch (err) {
        showNotification(err.msg, 'error')
      } finally {
        setLoading(false)
      }
    }
    _getWaitingConsults()
    return () => {
      controller.abort
    }
  }, [])

  const selectConsultToNextStep = (item) => {
    // If an element is already selected
    if (
      selectedConsult ||
      localStorage.getItem('meigital.admin:current_consult')
    ) {
      showNotification(
        'Ya existe una consulta en proceso, finalice la consulta para poder mover otra a consultorio',
        'warning'
      )
      return
    }
    // Set on localstorage the current consult
    localStorage.setItem('medigital.admin:current_consult', item._id)
    const consult = prepareConsultData(item)
    _updateConsult(consult)
    //setSelectedConsult(item)
    // Delete consult from waiting list
    setWaitingConsults((currentList) => {
      return currentList.filter((element) => element._id !== item._id)
    })
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
      status: 'IN PROGRESS',
      start_hour: moment().format('HH:mm'),
    }
  }
  return (
    <>
      <ToastContainer />
      {loading && <Loader />}
      <div className='d-flex justify-content-around align-items-center gap-3 flex-wrap'>
        {waitingConsults.length > 0 ? (
          waitingConsults.map((item) => {
            return (
              <DetailWaitingConsult
                key={item._id}
                value={item}
                selectConsultToNextStep={selectConsultToNextStep}
              />
            )
          })
        ) : (
          <p>No hay consultas pendientes en sala de espera</p>
        )}
      </div>
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
