import _API from '@/api/index.js'
import { getCredentialFromLocalStorage } from '@/helpers/auth.js'
import { useNavigate } from 'react-router-dom'

_API.interceptors.request.use(function (config) {
  const token = getCredentialFromLocalStorage()
  config.headers.Authorization = token ? `Bearer ${token}` : ''
  return config
})
_API.interceptors.response.use((config) => {
  if (config.status === 403) {
    localStorage.clear()
    RedirectLogin()
  }
  return config
})

// REDIRECT LOGIN
const RedirectLogin = () => {
  const navigate = useNavigate()
  navigate('/login', { replace: true })
}

export const getInfo = (signal) => {
  return new Promise((resolve, reject) => {
    _API
      .get(`/info`, {
        signal,
      })
      .then(({ data }) => resolve(data))
      .catch((error) => reject(error))
  })
}

export const login = (data) => {
  return new Promise((resolve, reject) => {
    _API
      .post(`/users/auth`, data)
      .then(({ data }) => resolve(data))
      .catch((error) => reject(error))
  })
}

export const getSpecificAppointment = (_id) => {
  return new Promise((resolve, reject) => {
    _API
      .get(`/appointments/${_id}`)
      .then(({ data }) => resolve(data))
      .catch((error) => reject(error))
  })
}

export const getPatients = (signal) => {
  return new Promise((resolve, reject) => {
    _API
      .get(`/patients`, {
        signal,
      })
      .then(({ data }) => resolve(data))
      .catch((error) => reject(error))
  })
}

export const getDoctors = (signal) => {
  return new Promise((resolve, reject) => {
    _API
      .get(`/doctors`, {
        signal,
      })
      .then(({ data }) => resolve(data))
      .catch((error) => reject(error))
  })
}

export const getWaitingConsults = (signal) => {
  return new Promise((resolve, reject) => {
    _API
      .get(`/consults?status=WAITING`, { signal })
      .then(({ data }) => resolve(data))
      .catch((error) => reject(error))
  })
}

export const getSpecificConsult = (_id, signal) => {
  return new Promise((resolve, reject) => {
    _API
      .get(`/consults/${_id}`, { signal })
      .then(({ data }) => resolve(data))
      .catch((error) => reject(error))
  })
}

export const getPrescriptionsByIdConsult = (_id, signal) => {
  return new Promise((resolve, reject) => {
    _API
      .get(`/prescriptions?consult=${_id}`, { signal })
      .then(({ data }) => resolve(data))
      .catch((error) => reject(error))
  })
}
export const createConsult = (data) => {
  return new Promise((resolve, reject) => {
    _API
      .post(`/consults`, data)
      .then(({ data }) => resolve(data))
      .catch((error) => reject(error))
  })
}

export const updateConsult = (data) => {
  return new Promise((resolve, reject) => {
    _API
      .put(`/consults/${data._id}`, data)
      .then(({ data }) => resolve(data))
      .catch((error) => reject(error))
  })
}

export const getDiagnostics = (signal) => {
  return new Promise((resolve, reject) => {
    _API
      .get(`/diagnostics`, { signal })
      .then(({ data }) => resolve(data))
      .catch((error) => reject(error))
  })
}

export const getMedicines = (signal) => {
  return new Promise((resolve, reject) => {
    _API
      .get(`/medicines`, { signal })
      .then(({ data }) => resolve(data))
      .catch((error) => reject(error))
  })
}

export const getAvailableMedicines = (signal) => {
  return new Promise((resolve, reject) => {
    _API
      .get(`/medicines?available=true`, { signal })
      .then(({ data }) => resolve(data))
      .catch((error) => reject(error))
  })
}

export const createMovement = (data) => {
  return new Promise((resolve, reject) => {
    _API
      .post(`/movements`, data)
      .then(({ data }) => resolve(data))
      .catch((error) => reject(error))
  })
}

export const getMovements = (signal) => {
  return new Promise((resolve, reject) => {
    _API
      .get(`/movements`, { signal })
      .then(({ data }) => resolve(data))
      .catch((error) => reject(error))
  })
}

export const getConsultsByPatient = (_id) => {
  return new Promise((resolve, reject) => {
    _API
      .get(`/consults?patient=${_id}`)
      .then(({ data }) => resolve(data))
      .catch((error) => reject(error))
  })
}
