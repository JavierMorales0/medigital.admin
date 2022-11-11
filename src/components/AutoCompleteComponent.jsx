import { AutoComplete } from 'primereact/autocomplete'
import { memo } from 'react'

const AutoCompleteComponent = ({
  value,
  field,
  suggestions,
  completeMethod,
  setValue,
  setData,
  placeholder = '',
}) => {
  return (
    <AutoComplete
      value={value}
      suggestions={suggestions}
      completeMethod={completeMethod}
      field={field}
      placeholder={placeholder}
      className='w-100'
      onChange={(e) => setValue(e)}
      onSelect={(e) => {
        setData(e)
      }}
    />
  )
}

export default memo(AutoCompleteComponent)
