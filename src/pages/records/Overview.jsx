import { useState, createContext, useEffect } from 'react'
import AutoCompleteComponent from '@/components/AutoCompleteComponent'
import { ToastContainer, toast } from 'react-toastify'
import { getPatients } from '@/api/endpoints.js'
import { Loader } from '@/components/Loader'

export const RecordContext = createContext()

export const Overview = () => {
  const [patient, setPatient] = useState('')
  const [patients, setPatients] = useState([])
  const [filteredPatients, setFilteredPatients] = useState([])
  const [loading, setLoading] = useState(false)

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
        console.log(response)
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
    if (patient.length !== 24) return
    console.log('pedir consults')
  }, [patient])

  const searchPatient = (event) => {
    const filter = findMatchesInName(event.query.toLowerCase(), patients)
    setFilteredPatients(filter)
  }

  return (
    <>
      {loading && <Loader />}
      <ToastContainer />
      <h4 className='m-0'>Expediente</h4>
      <h6 className='m-0 _light ms-2'>Modulo de expediente</h6>
      <RecordContext.Provider value={{ patient, setPatient }}>
        <section className='container text-center'>
          <p className='_bold mb-1'>Ingrese nombre de paciente</p>
          <div className='w-50 mx-auto'>
            <AutoCompleteComponent
              value={patient}
              suggestions={filteredPatients}
              completeMethod={searchPatient}
              field={'detail'}
              placeholder={'Seleccione un paciente'}
              setValue={(e) => setPatient(e.value)}
              setData={(e) => {
                setPatient(e.value._id)
              }}
            />
          </div>
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
