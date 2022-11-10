import { useContext, useEffect, useState } from 'react'
import { ConsultContext } from '@/pages/consults/Overview'
import { updateConsult, getDiagnostics } from '@/api/endpoints'
import { Loader } from '@/components/Loader'
import { Button } from 'primereact/button'
import { ToastContainer, toast } from 'react-toastify'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import moment from 'moment'
import { DiagnosticSelector } from '@/components/AutoComplete/DiagnosticSelector'

export const Doing = () => {
  const { selectedConsult, setSelectedConsult } = useContext(ConsultContext)
  const [loading, setLoading] = useState(false)
  const [diagnostic, setDiagnostic] = useState('')
  const [diagnostics, setDiagnostics] = useState([])
  const [filteredDiagnostics, setFilteredDiagnostics] = useState([])
  useEffect(() => {
    if (!selectedConsult) {
      const _consult = JSON.parse(
        localStorage.getItem('medigital.admin:current_consult')
      )
      setSelectedConsult(_consult)
    }
    const controllerGetDiagnostics = new AbortController()
    const _getDiagnostics = async () => {
      try {
        const response = await getDiagnostics(controllerGetDiagnostics.signal)
        const diagnosticsFormat = response.map((item) => {
          return { ...item, nameMin: item.name?.slice(0, 70) }
        })
        setDiagnostics(diagnosticsFormat)
      } catch (err) {
        showNotification(err.msg, 'error')
      }
    }
    _getDiagnostics()
    return () => {
      controllerGetDiagnostics.abort
    }
  }, [])
  const searchDiagnostic = (event) => {
    const filter = findMatchesInName(event.query?.toLowerCase(), diagnostics)
    setFilteredDiagnostics(filter)
  }

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
        <div className='d-flex justify-content-between align-items-center'>
          <p className='m-0 _bold'>ID: {selectedConsult._id} </p>
          <div>
            <p className='m-0'>
              {`${selectedConsult.patient.first_name} ${selectedConsult.patient.last_name}`}
            </p>
            <h6 className='m-0' style={{ maxWidth: '300px' }}>
              {selectedConsult.observations !== ''
                ? selectedConsult.observations
                : 'SIN OBSERVACIONES'}
            </h6>
          </div>
        </div>

        <hr />
        <p>
          Doctor:{' '}
          {`${selectedConsult.doctor.employee.first_name} ${selectedConsult.doctor.employee.last_name}`}
        </p>
        <section className='row'>
          <div className='col-12 col-md-6 my-2'>
            <label>Motivo *</label>
            <InputText
              value={selectedConsult.reason}
              onChange={(e) => {
                setSelectedConsult((current) => {
                  return { ...current, reason: e.target.value.toUpperCase() }
                })
              }}
              className='w-100'
              placeholder='Ingrese el motivo'
            />
          </div>
          <div className='col-12 col-md-3 my-2'>
            <label>Hallazgos f&iacute;sicos </label>
            <InputText
              value={selectedConsult.physical_finding}
              onChange={(e) => {
                setSelectedConsult((current) => {
                  return {
                    ...current,
                    physical_finding: e.target.value.toUpperCase(),
                  }
                })
              }}
              className='w-100'
              placeholder='Ingrese los hallazgos f&iacute;sicos'
            />
          </div>
          <div className='col-12 col-md-3 my-2'>
            <label>Historial m&eacute;dico </label>
            <InputText
              value={selectedConsult.medical_record}
              onChange={(e) => {
                setSelectedConsult((current) => {
                  return {
                    ...current,
                    medical_record: e.target.value.toUpperCase(),
                  }
                })
              }}
              className='w-100'
              placeholder='Ingrese el historial m&eacute;dico'
            />
          </div>
          <div className='col-12 col-md-6 my-2'>
            <label>Diagn&oacute;stico </label>
            <DiagnosticSelector
              value={diagnostic}
              suggestions={filteredDiagnostics.slice(0, 15)}
              completeMethod={searchDiagnostic}
              field={'nameMin'}
              setValue={setDiagnostic}
              setData={setSelectedConsult}
              placeholder={'Agregar un diagnóstico'}
            />
            <ul className='w-100'>
              {selectedConsult.diagnostic.map((item) => {
                return <li key={item._id}>{item.name}</li>
              })}
            </ul>
          </div>
          <div className='col-12 col-md-3 my-2'>
            <label>Observaciones </label>
            <InputTextarea
              value={selectedConsult.observations}
              onChange={(e) => {
                setSelectedConsult((current) => {
                  return {
                    ...current,
                    observations: e.target.value.toUpperCase(),
                  }
                })
              }}
              className='w-100'
              placeholder='Ingrese las observaciones'
            />
          </div>
        </section>
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

const findMatchesInName = (param, array) => {
  return array.filter((item) => {
    return `${item.name?.toLowerCase()}`.includes(param)
  })
}
