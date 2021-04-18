import axios from 'axios'
import jwt from 'jsonwebtoken'
// import router from '@/router'
import store from '@/_store/index'

// http response 공통 처리
axios.interceptors.response.use(
  function (response) {
    store.commit('setApiCallEnable', 'true')
    return response
  },
  function (error) {
    store.commit('setApiCallEnable', 'true')

    if (!error.response) {
      error.meta = {}
      error.meta.userMessage = '네트워크 에러입니다.'
      return Promise.reject(error)
    } else {
      var response = error.response.data || {}
      var code = parseFloat(error.response.status || response.status)
      if (!response.meta) {
        response.meta = {}
        response.meta.userMessage = response.message || '네트워크 에러입니다.'
      }

      if (code === 401 || code === 403 || code === 409) {
        var confirmMsg = response.meta.userMessage
        var reLogin = confirm(confirmMsg)
        if (reLogin) {
          sessionStorage.removeItem('member')
          document.location.href = '/login'
        } else {
          response.meta.userMessage = '로그인이 필요한 서비스입니다.'
          return Promise.reject(response)
        }
      } else {
        return Promise.reject(response)
      }
    }
  }
)

export function getValueFromJwt (key) {
  let accessToken = getToken()
  let value = ''

  if (accessToken) {
    accessToken = accessToken.replace('Bearer ', '')
    let decodeJwt = jwt.decode(accessToken, { complete: true })

    if (key in decodeJwt.payload) {
      value = decodeJwt.payload[key]
    }
  }
  return value
}

export function urlParam (name) {
  let results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href)
  if (results == null) {
    return null
  } else {
    return decodeURIComponent(results[1]) || 0
  }
}

export function checkTokenExpired () {
  const loggedIn = sessionStorage.getItem('member')

  if (loggedIn) {
    let accessToken = getToken()

    if (accessToken) {
      let jwtExpTime = getValueFromJwt('exp')
      let currentTime = Date.now().valueOf() / 1000

      if (jwtExpTime <= currentTime) {
        let member = JSON.parse(sessionStorage.getItem('member'))
        let refreshToken = (member && member.refreshToken) ? 'Refresh ' + member.refreshToken : ''
        let tokenRefreshUri = '/tokenRefresh'

        return axios.get(tokenRefreshUri, {
          baseURL: process.env.API_TOKEN_NO_AUTH_SERVER_HOST + process.env.API_TOKEN_BASE_PATH,
          headers: {
            'user-key': process.env.API_TOKEN_NO_AUTH_SERVER_USER_KEY,
            'Authorization': refreshToken
          }
        })
          .then((result) => {
            let tokenResult = result.data || result
            if (tokenResult && tokenResult.tokenMap && tokenResult.tokenMap.accessToken !== '') {
              sessionStorage.setItem('member', JSON.stringify(tokenResult.tokenMap))
              return Promise.resolve('TOKEN_REFRESH')
            }
          })
      } else {
        return Promise.resolve('TOKEN_VALID')
      }
    } else {
      var response = {}
      response.meta = {}
      response.meta.userMessage = '올바르지 않은 접근요청 입니다.'
      return Promise.reject(response)
    }
  } else {
    return Promise.resolve('NO_REQUIRE_TOKEN')
  }
}

/*
 * Wraps axios and provides
 * more convenient get method
 * calls with data.
 */
export function get (uri, data = {}, responseType, service) {
  if (Object.keys(data).length > 0) {
    uri = `${uri}?${qs(data)}`
  }

  if (store.state.apiCallEnable === 'true') {
    store.commit('setApiCallEnable', 'false')
    return checkTokenExpired()
      .then((result) => {
        if (result === 'TOKEN_VALID' || result === 'TOKEN_REFRESH' || result === 'NO_REQUIRE_TOKEN') {
          return axios.get(uri, {
            baseURL: getBaseUrl(service),
            headers: getHeaders(service),
            withCredentials: service === 'AUTH',
            responseType: responseType || 'json'
          })
        } else {
          alert(result)
        }
      })
  }
}

/*
 * Wraps axios and provides
 * more convenient post method
 * calls with payload data
 */
export function post (uri, data, responseType, service) {
  if (store.state.apiCallEnable === 'true') {
    store.commit('setApiCallEnable', 'false')
    return checkTokenExpired(uri)
      .then((result) => {
        if (result === 'TOKEN_VALID' || result === 'TOKEN_REFRESH' || result === 'NO_REQUIRE_TOKEN') {
          return axios.post(uri, data, {
            baseURL: getBaseUrl(service),
            headers: getHeaders(service),
            withCredentials: service === 'AUTH',
            responseType: responseType || 'json'
          })
        } else {
          alert(result)
        }
      })
  }
}

/*
 * Wraps axios and provides
 * more convenient put method
 * calls with data
 */
export function put (uri, data, responseType, service) {
  if (store.state.apiCallEnable === 'true') {
    store.commit('setApiCallEnable', 'false')
    return checkTokenExpired(uri)
      .then((result) => {
        if (result === 'TOKEN_VALID' || result === 'TOKEN_REFRESH' || result === 'NO_REQUIRE_TOKEN') {
          return axios.put(uri, data, {
            baseURL: getBaseUrl(service),
            headers: getHeaders(service),
            withCredentials: service === 'AUTH',
            responseType: responseType || 'json'
          })
        } else {
          alert(result)
        }
      })
  }
}

export function uploadPost (uri, data, responseType, service) {
  if (store.state.apiCallEnable === 'true') {
    store.commit('setApiCallEnable', 'false')
    return checkTokenExpired(uri)
      .then((result) => {
        if (result === 'TOKEN_VALID' || result === 'TOKEN_REFRESH' || result === 'NO_REQUIRE_TOKEN') {
          var uploadHeaders = getHeaders(service)
          uploadHeaders['Content-Type'] = 'multipart/form-data'
          return axios.post(uri, data, {
            baseURL: getBaseUrl(service),
            headers: uploadHeaders,
            withCredentials: service === 'AUTH',
            responseType: responseType || 'json'
          })
        } else {
          alert(result)
        }
      })
  }
}

export function uploadPut (uri, data, responseType, service) {
  if (store.state.apiCallEnable === 'true') {
    store.commit('setApiCallEnable', 'false')
    return checkTokenExpired(uri)
      .then((result) => {
        if (result === 'TOKEN_VALID' || result === 'TOKEN_REFRESH' || result === 'NO_REQUIRE_TOKEN') {
          var uploadHeaders = getHeaders(service)
          uploadHeaders['Content-Type'] = 'multipart/form-data'
          return axios.put(uri, data, {
            baseURL: getBaseUrl(service),
            headers: uploadHeaders,
            withCredentials: service === 'AUTH',
            responseType: responseType || 'json'
          })
        } else {
          alert(result)
        }
      })
  }
}

function getBaseUrl (service) {
  let serviceName = service ? service.toUpperCase() : ''
  let baseUrl = ''
  let basePath = ''

  if (serviceName === 'MAIN') {
    baseUrl = process.env.API_MAIN_NO_AUTH_SERVER_HOST
    basePath = process.env.API_MAIN_BASE_PATH
  } else if (serviceName === 'MEMBER') {
    baseUrl = process.env.API_MEMBER_NO_AUTH_SERVER_HOST
    basePath = process.env.API_MEMBER_BASE_PATH
  } else if (serviceName === 'ETC') {
    baseUrl = process.env.API_ETC_NO_AUTH_SERVER_HOST
    basePath = process.env.API_ETC_BASE_PATH
  } else if (serviceName === 'MARKET') {
    baseUrl = process.env.API_MARKET_NO_AUTH_SERVER_HOST
    basePath = process.env.API_MARKET_BASE_PATH
  } else if (serviceName === 'SVC') {
    baseUrl = process.env.API_SVC_NO_AUTH_SERVER_HOST
    basePath = process.env.API_SVC_BASE_PATH
  } else if (serviceName === 'RENTAL') {
    baseUrl = process.env.API_RENTAL_NO_AUTH_SERVER_HOST
    basePath = process.env.API_RENTAL_BASE_PATH
  } else if (serviceName === 'PARTS') {
    baseUrl = process.env.API_PARTS_NO_AUTH_SERVER_HOST
    basePath = process.env.API_PARTS_BASE_PATH
  } else if (serviceName === 'AUTH') {
    baseUrl = process.env.API_TOKEN_AUTH_SERVER_HOST
    basePath = process.env.API_TOKEN_BASE_PATH
  } else if (serviceName === 'NO_AUTH') {
    baseUrl = process.env.API_TOKEN_NO_AUTH_SERVER_HOST
    basePath = process.env.API_TOKEN_BASE_PATH
  } else {
    baseUrl = process.env.API_MAIN_NO_AUTH_SERVER_HOST
    basePath = process.env.API_MAIN_BASE_PATH
  }

  return baseUrl + basePath
}

/*
 * Returns default headers list
 * which will be used with every request.
 */
function getHeaders (service) {
  let serviceName = service ? service.toUpperCase() : ''
  let userKey = ''

  if (serviceName === 'MAIN') {
    userKey = process.env.API_MAIN_NO_AUTH_SERVER_USER_KEY
  } else if (serviceName === 'MEMBER') {
    userKey = process.env.API_MEMBER_NO_AUTH_SERVER_USER_KEY
  } else if (serviceName === 'ETC') {
    userKey = process.env.API_ETC_NO_AUTH_SERVER_USER_KEY
  } else if (serviceName === 'MARKET') {
    userKey = process.env.API_MARKET_NO_AUTH_SERVER_USER_KEY
  } else if (serviceName === 'SVC') {
    userKey = process.env.API_SVC_NO_AUTH_SERVER_USER_KEY
  } else if (serviceName === 'RENTAL') {
    userKey = process.env.API_RENTAL_NO_AUTH_SERVER_USER_KEY
  } else if (serviceName === 'PARTS') {
    userKey = process.env.API_PARTS_NO_AUTH_SERVER_USER_KEY
  } else if (serviceName === 'AUTH') {
    userKey = process.env.API_TOKEN_AUTH_SERVER_USER_KEY
  } else if (serviceName === 'NO_AUTH') {
    userKey = process.env.API_TOKEN_NO_AUTH_SERVER_USER_KEY
  } else {
    userKey = process.env.API_MAIN_NO_AUTH_SERVER_USER_KEY
  }

  let defaultHeaders = {
    'user-key': userKey
  }

  if (serviceName !== 'AUTH') {
    defaultHeaders.Authorization = getToken()
  }

  return defaultHeaders
}

function getToken () {
  let member = JSON.parse(sessionStorage.getItem('member'))
  let token = ''

  if (member && member.accessToken) {
    token = 'Bearer ' + member.accessToken
  }

  return token
}

// export function routerPush (url) {
//   store.commit('setCurrentPage', url)
//   router.push(url)
// }

// Just a convenient shorthand
export const esc = encodeURIComponent

// Returns formatted query string from object
export function qs (params) {
  return (
    Object
      .keys(params)
      .map(k => esc(k) + '=' + esc(params[k]))
      .join('&')
  )
}
