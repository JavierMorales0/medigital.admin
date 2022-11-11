import { useContext, useEffect, useState } from 'react'
import { ConsultContext } from '@/pages/consults/Overview'
import {
  updateConsult,
  getDiagnostics,
  getSpecificConsult,
} from '@/api/endpoints'
import { Loader } from '@/components/Loader'
import { Button } from 'primereact/button'
import { ToastContainer, toast } from 'react-toastify'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import moment from 'moment'
import AutoCompleteComponent from '@/components/AutoCompleteComponent'
import ListComponent from '@/components/ListComponent'
import ManagePrescriptions from '@/components/ManagePrescriptions'

export const Doing = () => {
  const { selectedConsult, setSelectedConsult } = useContext(ConsultContext)
  const [loading, setLoading] = useState(false)
  const [diagnostic, setDiagnostic] = useState('')
  const [diagnostics, setDiagnostics] = useState([])
  const [filteredDiagnostics, setFilteredDiagnostics] = useState([])
  useEffect(() => {
    let _consult = null
    if (!selectedConsult) {
      _consult = JSON.parse(
        localStorage.getItem('medigital.admin:current_consult')
      )
    }
    const controllerGetSpecificConsult = new AbortController()
    const _getSpecificConsult = async () => {
      try {
        const response = await getSpecificConsult(
          _consult._id,
          controllerGetSpecificConsult.signal
        )
        setSelectedConsult(response)
      } catch (err) {
        showNotification(err.msg, 'error')
      }
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
    _getSpecificConsult()
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
      end_hour: moment().format('HH:mm'),
    }
  }

  return selectedConsult !== null ? (
    <>
      <ToastContainer />
      {loading && <Loader />}
      <div>
        <div className='d-flex justify-content-between align-items-center'>
          <div>
            <p className='m-0 _bold'>ID: {selectedConsult._id} </p>
            <p className='m-0'>HORA INICIO: {selectedConsult.start_hour}</p>
          </div>
          <div>
            <p className='m-0'>
              {`${selectedConsult.patient.first_name} ${selectedConsult.patient.last_name}`}
            </p>
            <h6 className='m-0' style={{ maxWidth: '400px' }}>
              {selectedConsult.observations !== ''
                ? selectedConsult.observations
                : 'SIN OBSERVACIONES'}
            </h6>
            <Button
              label='Finalizar consulta'
              className='my-1 mx-auto d-block'
              onClick={finishConsult}
            />
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
            <AutoCompleteComponent
              value={diagnostic}
              suggestions={filteredDiagnostics.slice(0, 15)}
              completeMethod={searchDiagnostic}
              field={'nameMin'}
              placeholder={'Agregar un diagnóstico'}
              setValue={(e) => setDiagnostic(e.value)}
              setData={(e) => {
                setSelectedConsult((current) => {
                  console.log(current.diagnostic, 'current')
                  return {
                    ...current,
                    diagnostic: [...current.diagnostic, e.value],
                  }
                })
                setDiagnostic('')
              }}
            />
            {selectedConsult.diagnostic?.length > 0 ? (
              <>
                <div className='mt-2 d-flex justify-content-between align-items-center'>
                  <p className='text-center m-0'>
                    Listado de diagn&oacute;sticos
                  </p>
                </div>
                <ListComponent
                  list={selectedConsult.diagnostic}
                  selector='name'
                  prefix='*'
                  ulStyle={{
                    width: '100%',
                    listStyle: 'none',
                    padding: '10px',
                    margin: 0,
                    maxHeight: '100px',
                    overflow: 'auto',
                  }}
                  liStyle={{ fontWeight: '300', fontSize: '.9rem' }}
                />
                <Button
                  label='Limpiar lista'
                  className='p-button-text p-button-danger'
                  onClick={() =>
                    setSelectedConsult((current) => {
                      return { ...current, diagnostic: [] }
                    })
                  }
                />
              </>
            ) : null}
          </div>
          <div className='col-12 col-md-6 my-2'>
            <label>Observaciones </label>
            <InputTextarea
              value={selectedConsult.observations}
              rows={3}
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
          <div className='col-12'>
            <ManagePrescriptions _id={selectedConsult._id} />
          </div>
        </section>
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
