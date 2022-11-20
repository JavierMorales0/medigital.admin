import { useState, createContext } from 'react'
import { TabView, TabPanel } from 'primereact/tabview'
import { Create } from '@/pages/consults/Create'
import { Waiting } from '@/pages/consults/Waiting'
import { Doing } from '@/pages/consults/Doing'

export const ConsultContext = createContext()

export const Overview = () => {
  const [selectedConsult, setSelectedConsult] = useState(null)
  const [activeIndex, setActiveIndex] = useState(0)
  return (
    <section className=''>
      <div className='container'>
        <ConsultContext.Provider
          value={{ selectedConsult, setSelectedConsult }}
        >
          <TabView
            activeIndex={activeIndex}
            onTabChange={(e) => setActiveIndex(e.index)}
          >
            <TabPanel header='Creaci&oacute;n'>
              <Create />
            </TabPanel>
            <TabPanel header='Sala de espera'>
              <Waiting />
            </TabPanel>
            <TabPanel header='Consultorio'>
              <Doing />
            </TabPanel>
          </TabView>
        </ConsultContext.Provider>
      </div>
    </section>
  )
}
