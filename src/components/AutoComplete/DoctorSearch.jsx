import { AutoComplete } from 'primereact/autocomplete'

export const DoctorSearch = ({
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
          return { ...current, doctor: e.value }
        })
      }
      onSelect={(e) => {
        setData((current) => {
          return {
            ...current,
            doctor: e.value._id,
            selectedDoctorName: e.value.name,
          }
        })
      }}
    />
  )
}
