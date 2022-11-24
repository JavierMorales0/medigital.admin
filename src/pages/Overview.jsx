import { getInfo } from '@/api/endpoints'
import { useEffect, useState } from 'react'
import { Loader } from '@/components/Loader'
import { ToastContainer, toast } from 'react-toastify'
import { showNotification } from '@/helpers/notification'
import { Chart } from 'primereact/chart'

export const Overview = () => {
  const [loading, setLoading] = useState(false)
  const [lineChartData, setLineChartData] = useState(null)
  const [pieChartData, setPieChartData] = useState(null)
  useEffect(() => {
    const controller = new AbortController()

    const _getInfo = async () => {
      try {
        setLoading(true)
        const response = await getInfo(controller.signal)
        formatDataToPieChart(response.byGender)
        formatDataToLineChart(response.byDate)
      } catch (err) {
        showNotification(err.msg, 'error')
      } finally {
        setLoading(false)
      }
    }
    _getInfo()

    return () => {
      controller.abort
    }
  }, [])

  const formatDataToPieChart = (data) => {
    const labels = []
    const dataset = []
    data?.map((item) => {
      labels.push(item?._id[0])
      dataset.push(item?.count)
    })
    setPieChartData({
      labels,
      datasets: [
        {
          data: dataset,
          backgroundColor: ['#6366f1', '#2d2d2d'],
        },
      ],
    })
  }

  const formatDataToLineChart = (data) => {
    const labels = []
    const dataset = []
    data?.map((item) => {
      labels.push(item?._id)
      dataset.push(item?.count)
    })
    setLineChartData({
      labels,
      datasets: [
        {
          label: 'Número de consultas',
          data: dataset,
          fill: false,
          borderColor: '#6366f1',
          tension: 0.4,
        },
      ],
    })
  }
  let basicOptions = {
    maintainAspectRatio: false,
    aspectRatio: 0.6,
    plugins: {
      legend: {
        labels: {
          color: '#495057',
        },
      },
    },
  }
  const [lightOptions] = useState({
    plugins: {
      legend: {
        labels: {
          color: '#495057',
        },
      },
    },
  })
  return (
    <>
      <ToastContainer />
      {loading && <Loader />}
      <section className='d-flex justify-content-around'>
        <div>
          <p className='_bold'>Cantidad de consultas por g&eacute;nero</p>
          <Chart type='pie' data={pieChartData} options={lightOptions} />
          <p className='text-muted _light mt-4' style={{ fontSize: '12px' }}>
            Datos obtenidos y recolectados por el sistema MEDIGITAL
          </p>
        </div>
        <div className='w-50'>
          <p className='_bold'>Cantidad de consultas por mes</p>
          <Chart type='line' data={lineChartData} options={basicOptions} />{' '}
          <p className='text-muted _light mt-4' style={{ fontSize: '12px' }}>
            Datos obtenidos y recolectados por el sistema MEDIGITAL
          </p>
        </div>
      </section>
    </>
  )
}
