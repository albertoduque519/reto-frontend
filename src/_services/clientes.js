
import { authHeader } from '../_helpers'
import axios from 'axios'
import querystring from 'querystring'

export const clientService = {
  getClients,
  getDiskSpaceStatsByClient,
  getDiskSpaceStatsByDate
}

async function getClients() {
  return axios.get(`${process.env.VUE_APP_URLAPI_AUTHENTICATION}/clients`, authHeader())
}

async function getDiskSpaceStatsByClient(idClientes) {
  let queryParams = { 'idClientes': idClientes }
  return axios.get(`${process.env.VUE_APP_URLAPI_AUTHENTICATION}/stats/client-disk-usage?`, authHeader(queryParams))
}

async function getDiskSpaceStatsByDate(idClientes, startDate, endDate) {
  let queryParams = { 'idClientes': idClientes, 'startDate': startDate, 'endDate': endDate }
  return axios.get(`${process.env.VUE_APP_URLAPI_AUTHENTICATION}/stats/client-disk-usage-date?`, authHeader(queryParams))
}