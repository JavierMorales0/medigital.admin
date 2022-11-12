import { memo } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'

const Table = ({
  elements,
  fields,
  rows = 10,
  rowsPerPageOptions = [10, 20, 50],
}) => {
  return (
    <DataTable
      value={elements}
      responsiveLayout='scroll'
      stripedRows
      paginator
      paginatorTemplate='CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown'
      currentPageReportTemplate='Mostrando del {first} al {last} de {totalRecords}'
      rows={rows}
      rowsPerPageOptions={rowsPerPageOptions}
    >
      {fields.map((item, index) => {
        return (
          <Column
            field={item.field}
            header={item.header}
            key={index}
            filter={item?.isFilter}
            filterPlaceholder={item?.isFilterPlaceholder}
          ></Column>
        )
      })}
    </DataTable>
  )
}

export default memo(Table)
