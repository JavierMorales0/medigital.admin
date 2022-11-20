import { Timeline } from 'primereact/timeline'
import { CardComponent } from '@/components/CardComponent'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'

export const TimelineConsults = ({ consults }) => {
  const navigate = useNavigate()
  const handleClick = (_id) => {
    navigate(`/consulta/${_id}`)
  }

  return consults.length > 0 ? (
    <Timeline
      value={consults}
      align='alternate'
      opposite={(item) => <p>{moment(item.date).format('ll')}</p>}
      content={(item) => (
        <CardComponent
          title={item.reason}
          subtitle={`Hora: ${item.start_hour} - ${item.end_hour}`}
          content={item.observations}
          _id={item._id}
          handleClick={() => handleClick(item._id)}
        />
      )}
    />
  ) : (
    <p className='m-0 '>No tiene historial de consultas</p>
  )
}
