export const mainRoutes = [
  {
    label: 'Inicio',
    url: '/',
  },
  {
    label: 'Consulta',
    url: '/consulta',
  },
  {
    label: 'Expediente',
    url: '/expediente',
  },
  {
    label: 'Medicamentos',
    url: '/medicamentos',
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
