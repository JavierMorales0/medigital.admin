import Table from '@/components/Table'
import { useEffect, useState } from 'react'
import { getMedicines, getMovements } from '@/api/endpoints'
import { ToastContainer, toast } from 'react-toastify'
import RegisterMovement from '@/components/RegisterMovement'
import { Loader } from '@/components/Loader'

export const Overview = () => {
  const [hasChanges, setHasChanges] = useState(false)
  const [medicines, setMedicines] = useState([])
  const [movements, setMovements] = useState([])
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    const MedicinesController = new AbortController()
    const MovementsController = new AbortController()
    const _getMedicines = async () => {
      try {
        setLoading(true)
        const response = await getMedicines(MedicinesController.signal)
        setMedicines(response)
      } catch (err) {
        showNotification(err.msg, 'error')
      } finally {
        setLoading(false)
      }
    }
    const _getMovements = async () => {
      try {
        setLoading(true)
        const response = await getMovements(MovementsController.signal)
        setMovements(response)
      } catch (err) {
        showNotification(err.msg, 'error')
      } finally {
        setLoading(false)
      }
    }
    _getMedicines()
    _getMovements()

    return () => {
      MovementsController.abort
      MedicinesController.abort
    }
  }, [hasChanges])

  return (
    <>
      <ToastContainer />
      {loading && <Loader />}
      <section>
        <h4 className='m-0'>Medicamentos</h4>
        <h6 className='m-0 _light ms-2'>Modulo de inventarios</h6>
        <div className='container'>
          <div className='mb-3' style={{ minHeight: '200px' }}>
            <section className='row'>
              <div className='col-12 col-md-6 '>
                <p className='_bold'>Registrar movimiento</p>
                <RegisterMovement
                  type='OUT'
                  medicines={medicines}
                  whenChanges={() => setHasChanges((current) => !current)}
                />
              </div>
              <div className='col-12 col-md-6 '>
                <p className='_bold'>Movimientos realizados</p>{' '}
                <Table
                  elements={movements}
                  fields={movementsFieldsToShow}
                  rows={4}
                  rowsPerPageOptions={[2, 4]}
                />
              </div>
            </section>
          </div>
          <hr />
          <div>
            <p className='_bold'>Listado de medicamentos</p>
            <Table elements={medicines} fields={medicineFieldsToShow} />
          </div>
        </div>
      </section>
    </>
  )
}
const showNotification = (msg, status) => {
  const options = {
    position: 'top-right',
    autoClose: 2000,
    hideProgressBar: true,
    theme: 'light',
  }
  switch (status) {
    case 'success':
      return toast.success(msg, options)
    case 'warning':
      return toast.warn(msg, options)
    case 'error':
      return toast.error(msg, options)
    default:
      return toast.info(msg, options)
  }
}

const medicineFieldsToShow = [
  {
    field: 'name',
    header: 'Nombre',
    isFilter: true,
    isFilterPlaceholder: 'Buscar por nombre de medicamento',
  },
  {
    field: 'owner',
    header: 'Fabricante',
  },
  {
    field: 'quantity',
    header: 'Cantidad',
  },
  {
    field: 'register',
    header: 'Registro',
  },
  {
    field: 'usage',
    header: 'Uso',
    isFilter: true,
    isFilterPlaceholder: 'Buscar por uso',
  },
]
const movementsFieldsToShow = [
  {
    field: '_type',
    header: 'Tipo',
  },
  {
    field: 'medicine.name',
    header: 'Medicamento',
    isFilter: true,
    isFilterPlaceholder: 'Buscar por medicamento',
  },
  {
    field: 'quantity',
    header: 'Cant.',
  },
  {
    field: 'observations',
    header: 'Observaciones',
  },
]
