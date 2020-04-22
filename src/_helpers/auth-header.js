export function authHeader(params = {}) {
  // return authorization header with jwt token
  const user = JSON.parse(localStorage.getItem('user'))
  if (user && user.token) {
    const token = user.token.split(' ')
    return {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token[1],
      },
      params: params
    }
  } else {
    return {}
  }
}
