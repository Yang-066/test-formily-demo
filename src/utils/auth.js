import Cookies from 'js-cookie'

export function getToken (TokenKey = 'dpd-portal-token') {
  return Cookies.get(TokenKey)
}

export function setToken (TokenKey = 'dpd-portal-token', token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken (TokenKey = 'dpd-portal-token') {
  return Cookies.remove(TokenKey)
}

export function formatter (number) {
  const numbers = number.toString().split('').reverse()
  const segs = []

  while (numbers.length) segs.push(numbers.splice(0, 3).join(''))

  return segs.join(',').split('').reverse().join('')
}
