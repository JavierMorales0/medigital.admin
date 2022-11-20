import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getSpecificConsult } from '@/api/endpoints'
import { showNotification } from '@/helpers/notification'
import { ToastContainer, toast } from 'react-toastify'
import { Loader } from '@/components/Loader'
import moment from 'moment'
import { Badge } from 'primereact/badge'

export const Detail = () => {
  const { id } = useParams()
  const [consult, setConsult] = useState(null)
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    const controller = new AbortController()
    const _getSpecificConsult = async () => {
      try {
        setLoading(true)
        const response = await getSpecificConsult(id, controller.signal)
        setConsult(response)
      } catch (err) {
        showNotification(err.msg, 'error')
      } finally {
        setLoading(false)
      }
    }
    _getSpecificConsult()
    return () => {
      controller.abort
    }
  }, [])
  return (
    <>
      <ToastContainer /> {loading && <Loader />}
      {consult ? (
        <section className='container'>
          <p className='_bold m-0' style={{ fontSize: '1.5rem' }}>
            {`${moment(consult?.date?.slice(0, 10)).format('ll')}`}
          </p>
          <Badge value={consult?._status}></Badge>
          <p className='m-0'>
            Hora: {consult?.start_hour} - {consult?.end_hour}
          </p>
          <p className='_light mt-3 mb-0'>#{consult?._id}</p>
          <p className='m-0' style={{ fontSize: '1.5rem' }}>
            {consult?.reason.length > 0 ? consult?.reason : '--'}
          </p>
          <p>
            {consult?.observations.length > 0 ? consult?.observations : '--'}
          </p>
          <hr />
          <div className='row'>
            <div className='col-12 col-md-6'>
              <p className='_bold'>Paciente</p>
              <p>
                {consult?.patient?.first_name} {consult?.patient?.last_name}
              </p>
            </div>
            <div className='col-12 col-md-6'>
              <p className='_bold'>Doctor</p>{' '}
              <p>
                Dr. {consult?.doctor?.employee?.first_name}{' '}
                {consult?.doctor?.employee?.last_name}
              </p>
            </div>
          </div>
          <hr />
          <div className='row'>
            <div className='col-12 col-md-6'>
              <p>Diagn&oacute;sticos: </p>
              <ul>
                {consult?.diagnostic.map((item, index) => {
                  return (
                    <li key={index}>
                      <div className='container'>
                        <p className='m-0'>{item.name}</p>
                        <span className='' style={{ fontSize: '.9rem' }}>
                          Cod. {item.code}
                        </span>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
            <div className='col-12 col-md-6'>
              <p>
                Historial m&eacute;dico:{' '}
                {consult?.medical_record ? consult?.medical_record : '--'}
              </p>
              <p>
                Hallazgos f&iacute;sicos:{' '}
                {consult?.physical_finding ? consult?.physical_finding : '--'}
              </p>
            </div>
          </div>
          <hr />
          {consult.prev_appointment ? (
            <div className='container text-center'>
              <p className='_bold' style={{ fontSize: '1.2rem' }}>
                Cita previa
              </p>
              <p className='m-0'>
                Fecha programada:{' '}
                <span className='_bold'>
                  {moment(consult?.prev_appointment?.date).format('DD-MM-YYYY')}
                </span>
              </p>
              <p className='m-0'>
                Hora programada:{' '}
                <span className='_bold'>{consult?.prev_appointment?.hour}</span>
              </p>
            </div>
          ) : null}
        </section>
      ) : (
        <p>No existe la consulta</p>
      )}
    </>
  )
}
