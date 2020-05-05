
import { authHeader } from '../_helpers'
import conn from './config'

export const clientService = {
  getClients,
  getDiskSpaceStatsByClient,
  getDiskSpaceStatsByDate,
  getUsers
}

async function getClients() {
  return conn.get(`${process.env.VUE_APP_URLAPI_AUTHENTICATION}/clients`, authHeader())
}

async function getUsers() {
  return conn.get(`${process.env.VUE_APP_URLAPI_AUTHENTICATION}/users`, authHeader())
}

async function getDiskSpaceStatsByClient(idClientes) {
  let queryParams = { 'idClientes': idClientes }
  return conn.get(`${process.env.VUE_APP_URLAPI_AUTHENTICATION}/stats/client-disk-usage?`, authHeader(queryParams))
}

async function getDiskSpaceStatsByDate(idClientes, startDate, endDate) {
  let queryParams = { 'idClientes': idClientes, 'startDate': startDate, 'endDate': endDate }
  return conn.get(`${process.env.VUE_APP_URLAPI_AUTHENTICATION}/stats/client-disk-usage-date?`, authHeader(queryParams))
}