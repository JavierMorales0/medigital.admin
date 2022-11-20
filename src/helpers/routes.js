export const mainRoutes = [
  {
    label: 'Inicio',
    url: '/',
    icon: 'pi pi-home',
  },
  {
    label: 'Consulta',
    url: '/consulta',
    icon: 'pi pi-clock',
  },
  {
    label: 'Expediente',
    url: '/expediente',
    icon: 'pi pi-file',
  },
  {
    label: 'Medicamentos',
    url: '/medicamentos',
    icon: 'pi pi-book',
  },
]

export const routes = [
  {
    label: 'Inicio',
    matchWords: ['casa', 'inicio', 'dashboard', 'principal'],
    url: '/',
  },
  {
    label: 'Consulta',
    matchWords: ['consulta', 'cita', 'medica'],
    url: '/consulta',
  },
  {
    label: 'Crear consulta',
    matchWords: ['crear', 'nueva'],
    url: '/consulta/crear',
  },
  {
    label: 'Editar consulta',
    matchWords: ['editar', 'actualizar'],
    url: null,
    message: 'Es requerido hacerlo desde la pantalla de administración',
  },
  {
    label: 'Expediente',
    matchWords: ['expediente', 'papeleo', 'historial'],
    url: '/expediente',
  },
  {
    label: 'Medicamentos',
    matchWords: ['inventario', 'productos', 'medicinas', 'medicamentos'],
    url: '/medicamentos',
  },
]
