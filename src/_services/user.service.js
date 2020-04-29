
import { authHeader } from '../_helpers'
import conn from './config'

export const userService = {
  login,
  logout,
  getAll,
}

async function login(username, password) {
  const params = {
    username,
    password,
  }

  return conn.post(`${process.env.VUE_APP_URLAPI_AUTHENTICATION}/authentication`, params, authHeader())
    .then(user => {
      if (user.data.token) {
        localStorage.setItem('user', JSON.stringify(user.data))
      }
      return user
    })
}

function logout() {
  localStorage.removeItem('user')
}

function getAll() {
  return conn.get(`${process.env.VUE_APP_URLAPI_AUTHENTICATION}/user/data`, authHeader()).then(handleResponse)
}

function handleResponse(response) {
  if (!response.ok) {
    if (response.status === 401) {
      logout()
      location.reload(true)
    }
    // eslint-disable-next-line prefer-promise-reject-errors
    return Promise.reject()
  }
  return response.data
}
