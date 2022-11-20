import { Button } from 'primereact/button'
import { Card } from 'primereact/card'

export const CardComponent = ({
  title,
  subtitle = '',
  content = '',
  _id = null,
  footer = '',
  handleClick = null,
}) => {
  return (
    <Card
      style={{ margin: '0px 0px 24px 0px' }}
      title={title}
      subTitle={subtitle}
    >
      <p className='mb-2'>{content}</p>
      {_id ? (
        <Button
          label='Ver más'
          className=' mx-auto d-block'
          style={{ minWidth: '200px' }}
          onClick={handleClick ? handleClick : null}
        />
      ) : null}
    </Card>
  )
}
