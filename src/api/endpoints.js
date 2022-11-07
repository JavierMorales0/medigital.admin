import _API from '@/api/index.js'
import { getCredentialFromLocalStorage } from '@/helpers/auth.js'

_API.interceptors.request.use(function (config) {
  const token = getCredentialFromLocalStorage()
  config.headers.Authorization = token ? `Bearer ${token}` : ''
  return config
})

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