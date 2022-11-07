import { Button } from 'primereact/button'
import moment from 'moment'

export const DetailWaitingConsult = ({ value, selectConsultToNextStep }) => {
  return (
    <div
      className='px-3 py-2 p-card'
      style={{
        minWidth: '500px',
      }}
    >
      <div className='d-flex justify-content-between align-items-center'>
        <p className='_bold m-0' style={{ fontSize: '1.2rem' }}>
          {value.reason}
        </p>
        <p className='m-0'>{moment(value.date).format('ll')}</p>
      </div>
      {value.observations ? <p className='m-0'>{value.observations}</p> : null}
      <hr />
      <p className='_bold m-0'>
        Paciente: {value.patient.first_name} {value.patient.last_name}
      </p>
      <p className='' style={{ fontSize: '.9rem' }}>
        Doctor: {value.doctor.employee.first_name}{' '}
        {value.doctor.employee.last_name}
      </p>
      {value.prev_appointment ? (
        <span className='badge bg-success'>Cita previa</span>
      ) : (
        <span className='badge bg-dark'>Consulta directa</span>
      )}
      <hr />
      <Button
        className='p-button-sm d-block mx-auto'
        label='Mover a consultorio'
        icon='pi pi-reply'
        onClick={() => selectConsultToNextStep(value)}
      />
    </div>
  )
}
