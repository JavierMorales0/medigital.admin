import { memo } from 'react'

const ListComponent = ({
  list,
  selector,
  prefix = '',
  ulStyle = {},
  liStyle = {},
}) => {
  return (
    <ul style={ulStyle}>
      {list.map((item, index) => {
        return (
          <li key={index} style={liStyle}>
            {prefix} {item[selector]}
          </li>
        )
      })}
    </ul>
  )
}

export default memo(ListComponent)
