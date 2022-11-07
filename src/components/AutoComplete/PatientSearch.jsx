import { AutoComplete } from 'primereact/autocomplete'

export const PatientSearch = ({
  value,
  field,
  suggestions,
  completeMethod,
  setData,
}) => {
  return (
    <AutoComplete
      value={value}
      suggestions={suggestions}
      completeMethod={completeMethod}
      field={field}
      className='w-100'
      onChange={(e) =>
        setData((current) => {
          return { ...current, patient: e.value }
        })
      }
      onSelect={(e) => {
        setData((current) => {
          return {
            ...current,
            patient: e.value._id,
            seletedPatientName: e.value.name,
          }
        })
      }}
    />
  )
}
