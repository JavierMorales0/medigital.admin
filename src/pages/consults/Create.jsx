import { InputText } from 'primereact/inputtext'
import { Calendar } from 'primereact/calendar'
import { InputTextarea } from 'primereact/inputtextarea'
import { Button } from 'primereact/button'
import { useRef, useState, useEffect } from 'react'
import { Loader } from '@/components/Loader'
import {
  getSpecificAppointment,
  getPatients,
  getDoctors,
  createConsult as _createConsult,
} from '@/api/endpoints.js'
import { validateCreateConsult } from '@/helpers/validation'
import { ToastContainer, toast } from 'react-toastify'
import AutoCompleteComponent from '@/components/AutoCompleteComponent'

export const Create = () => {
  const appointmentRef = useRef()
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(false)
  const [filteredPatients, setFilteredPatients] = useState([])
  const [doctors, setDoctors] = useState([])
  const [filteredDoctors, setFilteredDoctors] = useState([])
  const [consult, setConsult] = useState({
    reason: '',
    date: new Date(),
    hour: '',
    prevAppointment: '',
    suggestPatientName: '',
    seletedPatientName: '',
    patient: '',
    doctor: '',
    selectedDoctorName: '',
    observations: '',
  })

  useEffect(() => {
    appointmentRef.current.focus()
    const controllerGetPatients = new AbortController()
    const controllerGetDoctors = new AbortController()
    const _getPatients = async () => {
      try {
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
      }
    }
    const _getDoctors = async () => {
      try {
        const response = await getDoctors(controllerGetDoctors.signal)
        const doctorsWithFullName = response.map((item) => {
          return {
            ...item,
            name: `${item?.employee.first_name} ${item?.employee.last_name}`,
          }
        })
        setDoctors(doctorsWithFullName)
      } catch (err) {
        showNotification(err.msg, 'error')
      }
    }
    _getPatients()
    _getDoctors()
    return () => {
      controllerGetPatients.abort
      controllerGetDoctors.abort
    }
  }, [])
  useEffect(() => {
    if (consult.prevAppointment.length !== 24) {
      setConsult((current) => {
        return {
          ...current,
          reason: '',
          suggestPatientName: '',
          observations: '',
        }
      })
    }
    verifyAppointment(consult.prevAppointment)
  }, [consult.prevAppointment])

  useEffect(() => {
    if (consult.patient.length !== 24)
      setConsult((current) => {
        return { ...current, seletedPatientName: '' }
      })
  }, [consult.patient])
  useEffect(() => {
    if (consult.doctor.length !== 24)
      setConsult((current) => {
        return { ...current, selectedDoctorName: '' }
      })
  }, [consult.doctor])

  const verifyAppointment = async (value) => {
    if (value.length !== 24) return
    try {
      setLoading(true)
      const response = await getSpecificAppointment(value)
      setConsult((current) => {
        return {
          ...current,
          reason: response.reason,
          observations: response.observations,
          suggestPatientName: response.name,
        }
      })
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

  const searchDoctor = (event) => {
    const filter = findMatchesInName(event.query.toLowerCase(), doctors)
    setFilteredDoctors(filter)
  }

  const createConsult = async () => {
    const isValid = validateCreateConsult(consult)
    if (!isValid.status) {
      showNotification(isValid.msg, 'warning')
    }
    try {
      setLoading(true)
      await _createConsult({
        ...consult,
        date: consult.date.toISOString().slice(0, 10),
      })
      showNotification('Consulta creada con éxito', 'success')
      setConsult({
        reason: '',
        date: new Date(),
        hour: '',
        prevAppointment: '',
        suggestPatientName: '',
        seletedPatientName: '',
        patient: '',
        doctor: '',
        selectedDoctorName: '',
        observations: '',
      })
    } catch (err) {
      showNotification(err.msg, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {loading && <Loader />}
      <ToastContainer />
      <div className='mx-auto my-2' style={{ maxWidth: '400px' }}>
        <label>Cita previa</label>
        <InputText
          value={consult.prevAppointment}
          onChange={(e) =>
            setConsult((current) => {
              return { ...current, prevAppointment: e.target.value }
            })
          }
          ref={appointmentRef}
          className='w-100'
          placeholder='Ingrese el ID de la cita'
        />
      </div>
      <hr />
      <div className='row'>
        <div className='col-12 col-md-3 my-2'>
          <label>Motivo *</label>
          <InputText
            value={consult.reason}
            onChange={(e) =>
              setConsult((current) => {
                return { ...current, reason: e.target.value.toUpperCase() }
              })
            }
            className='w-100'
            placeholder='Ingrese el motivo de la cita'
          />
        </div>
        <div className='col-12 col-md-3 my-2'>
          <label>Fecha *</label>
          <Calendar
            value={consult.date}
            className='w-100'
            placeholder='Seleccione la fecha'
            disabled
          ></Calendar>
        </div>
        <div className='col-12 col-md-6 my-2'>
          <label>Paciente *</label>
          <AutoCompleteComponent
            value={consult.patient}
            suggestions={filteredPatients}
            completeMethod={searchPatient}
            field={'detail'}
            placeholder={'Seleccione un paciente'}
            setValue={(e) =>
              setConsult((current) => {
                return { ...current, patient: e.value }
              })
            }
            setData={(e) =>
              setConsult((current) => {
                return {
                  ...current,
                  patient: e.value._id,
                  seletedPatientName: e.value.name,
                }
              })
            }
          />
          <p className='text-muted m-0' style={{ fontSize: '.8rem' }}>
            Sugerencia: {consult.suggestPatientName}
          </p>
          {consult.patient !== '' && consult.seletedPatientName !== '' ? (
            <p className=' m-0' style={{ fontSize: '.8rem' }}>
              Seleccionado: {consult.seletedPatientName}
            </p>
          ) : null}
        </div>
        <div className='col-12 col-md-6 my-2'>
          <label>Doctor *</label>
          <AutoCompleteComponent
            value={consult.doctor}
            suggestions={filteredDoctors}
            completeMethod={searchDoctor}
            field={'name'}
            placeholder={'Seleccione un doctor'}
            setValue={(e) =>
              setConsult((current) => {
                return { ...current, doctor: e.value }
              })
            }
            setData={(e) =>
              setConsult((current) => {
                return {
                  ...current,
                  doctor: e.value._id,
                  selectedDoctorName: e.value.name,
                }
              })
            }
          />
          {consult.doctor !== '' && consult.selectedDoctorName !== '' ? (
            <p className=' m-0' style={{ fontSize: '.8rem' }}>
              Seleccionado: {consult.selectedDoctorName}
            </p>
          ) : null}
        </div>
        <div className='col-12 col-md-6 my-2'>
          <label>Observaciones</label>
          <InputTextarea
            value={consult.observations}
            onChange={(e) =>
              setConsult((current) => {
                return {
                  ...current,
                  observations: e.target.value.toUpperCase(),
                }
              })
            }
            className='w-100'
            placeholder='Ingrese las observaciones pertinentes'
          />
        </div>
      </div>
      <Button
        label='Crear consulta'
        className='d-block ms-auto'
        style={{ minWidth: '200px' }}
        onClick={createConsult}
      />
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
