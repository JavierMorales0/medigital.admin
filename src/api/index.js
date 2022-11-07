import axios from 'axios'

// IMPORT CONFIG
import { BASE_URL } from '@/api/config.js'
const _API = axios.create({
  baseURL: BASE_URL,
})

export default _API
