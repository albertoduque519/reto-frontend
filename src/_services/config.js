import axios from 'axios'
let axiosInst = axios.create({
  baseURL: window.location.origin
})

/**
 * Intersepta los errores con status 401 (sin autorizacion)
 * para realizar una accion de logout
*/
axiosInst.interceptors.response.use(function (response) {
  return response
}, function (error) {
  /* eslint no-param-reassign: 0 */
  error.response.message = 'Lo sentimos ha ocurrido un error'

  if (error.response.status === 401) {
    error.response.message = error.response.data.message
    window.location.href = "/login";
  }
  return Promise.reject(error)
})

export default axiosInst
