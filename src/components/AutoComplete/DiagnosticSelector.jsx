import { AutoComplete } from 'primereact/autocomplete'

export const DiagnosticSelector = ({
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
      onChange={(e) => setValue(() => e.value)}
      onSelect={(e) => {
        setData((current) => {
          return { ...current, diagnostic: [...current.diagnostic, e.value] }
        })
        setValue('')
      }}
    />
  )
}
