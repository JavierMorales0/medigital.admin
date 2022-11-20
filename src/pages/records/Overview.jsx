import { useState, createContext, useEffect } from 'react'
import AutoCompleteComponent from '@/components/AutoCompleteComponent'
import { ToastContainer, toast } from 'react-toastify'
import { getPatients, getConsultsByPatient } from '@/api/endpoints.js'
import { Loader } from '@/components/Loader'
import { TimelineConsults } from '@/components/TimelineConsults'

export const RecordContext = createContext()

export const Overview = () => {
  const [patient, setPatient] = useState('')
  const [detailPatient, setDetailPatient] = useState(null)
  const [patients, setPatients] = useState([])
  const [filteredPatients, setFilteredPatients] = useState([])
  const [loading, setLoading] = useState(false)
  const [consults, setConsults] = useState([])

  useEffect(() => {
    const controllerGetPatients = new AbortController()
    const _getPatients = async () => {
      try {
        setLoading(true)
        const response = await getPatients(controllerGetPatients.signal)
        const patientsWithFullNameAndDui = response.map((item) => {
          return {
            ...item,
            name: `${item.first_name} ${item.last_name}`,
            detail: `${item.first_name} ${item.last_name} / ${item?.dui}`,
          }
        })
        setPatients(patientsWithFullNameAndDui)
      } catch (err) {
        showNotification(err.msg, 'error')
      } finally {
        setLoading(false)
      }
    }
    _getPatients()
    return () => {
      controllerGetPatients.abort
    }
  }, [])

  useEffect(() => {
    if (patient.length !== 24) {
      setDetailPatient(null)
      setConsults([])
      return
    }
    _getConsultsByPatient(patient)
  }, [patient])

  const _getConsultsByPatient = async (_id) => {
    try {
      setLoading(true)
      const response = await getConsultsByPatient(_id)
      setConsults(response)
    } catch (err) {
      showNotification(err.msg, 'error')
    } finally {
      setLoading(false)
    }
  }

  const searchPatient = (event) => {
    const filter = findMatchesInName(event.query.toLowerCase(), patients)
    setFilteredPatients(filter)
  }

  return (
    <>
      {loading && <Loader />}
      <ToastContainer />
      <RecordContext.Provider value={{ patient, setPatient }}>
        <section className='container text-center'>
          <p className='_bold mb-1'>Ingrese nombre de paciente</p>
          <div className='w-50 mx-auto mb-2'>
            <AutoCompleteComponent
              value={patient}
              suggestions={filteredPatients}
              completeMethod={searchPatient}
              field={'detail'}
              placeholder={'Seleccione un paciente'}
              setValue={(e) => setPatient(e.value)}
              setData={(e) => {
                setPatient(e.value._id)
                setDetailPatient(e.value)
              }}
            />
          </div>
          <hr />
          {detailPatient ? (
            <div className='container text-start' style={{ fontSize: '16px' }}>
              <p className='my-1 _bold' style={{ fontSize: '24px' }}>
                {detailPatient?.name}
              </p>
              <p className='m-0 '>DUI: {detailPatient?.dui}</p>
              <p className='m-0'>Tipo de sangre: {detailPatient?.blood_type}</p>
              <p className='m-0 '>Contacto:</p>
              <ul className='m-0'>
                {detailPatient?.phone_number?.map((item, index) => {
                  return <li key={index}>{item}</li>
                })}
              </ul>
              <p className='m-0 _bold'>{`${detailPatient.address}, ${detailPatient.municipality.name}, ${detailPatient.department.name}`}</p>
            </div>
          ) : (
            <p>No se ha seleccionado ning&uacute;n paciente</p>
          )}
          <hr />
          {detailPatient ? (
            <div className='container mt-4'>
              <TimelineConsults consults={consults} />
            </div>
          ) : null}
        </section>
      </RecordContext.Provider>
    </>
  )
}

const findMatchesInName = (param, array) => {
  return array.filter((item) => {
    return `${item.name.toLowerCase()}`.includes(param)
  })
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
