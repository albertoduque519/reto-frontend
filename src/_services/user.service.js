
import { authHeader } from '../_helpers'
import conn from './config'

export const userService = {
  login,
  logout,
  getUser,
  updateUser,
  createUser
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
      return user.data
    })
}

function logout() {
  localStorage.removeItem('user')
}

function getUser() {
  return conn.get(`${process.env.VUE_APP_URLAPI_AUTHENTICATION}/verificacion`, authHeader()).then(user => {
    return user
  })
}

async function updateUser(userInfo) {
  let params = { 'userInfo': userInfo }
  return conn.put(`${process.env.VUE_APP_URLAPI_AUTHENTICATION}/user/${userInfo.id}`, params, authHeader())
    .then(user => {
      return user
    })
}

async function createUser(userInfo) {
  let params = { 'userInfo': userInfo }
  return conn.post(`${process.env.VUE_APP_URLAPI_AUTHENTICATION}/user`, params, authHeader())
    .then(user => {
      return user
    })
}

