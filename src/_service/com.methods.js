import Vue from 'vue'
// import router from '@/router'
import store from '@/_store/index'
import * as http from '@/_service/http.methods'

/*******************************************************
 * 공통 코드 호출 !!
 * @param   : {object}  obj
 * @param   : {object}  params
 * @returns : N/A
 * @description : params ex) {grpCd: '', objNm: '', opt: '', etcFrst: '', etc: ''}
 *******************************************************/
export function getComCdInfos (obj, params) {
  http.post('/getComCdInfos', params, '', '')
    .then((result) => {
      for (let i = 0; i < params.length; i++) {
        let objNm = params[i].objNm

        obj[objNm] = result.data.data[objNm]
      }

      // 공통 코드 호출 후 바로 function 호출 시
      let callback = obj.getComCdInfosCallback

      if (callback && typeof (callback) === 'function') {
        callback()
      }
    })
}

/*******************************************************
 * 로그아웃
 *******************************************************/
export function logout () {
  let member = JSON.parse(sessionStorage.getItem('member'))
  sessionStorage.removeItem('drtPopupClickYn')
  sessionStorage.removeItem('myPageNewCnt')

  if (member && member.accessToken) {
    http.get('/removeToken', '', '', 'NO_AUTH')
      .then((result) => {
        sessionStorage.removeItem('member')
        document.location.href = '/login'
      })
      .catch((result) => {
        document.location.href = '/login'
      })
  } else {
    document.location.href = '/login'
  }
}

/*******************************************************
 * 로그인 세션 조회
 * @param   : N/A
 * @returns : {String} memId
 *******************************************************/
export function getLoginSession () {
  // 세션 조회
  let member = JSON.parse(sessionStorage.getItem('member'))

  if (member && member.memId) {
    return member.memId
  } else {
    return null
  }
}

/*******************************************************
 * 쿠키조회
 * @param   : {String} cookieName
 * @returns : {String} cookieValue
 *******************************************************/
export function getCookie (cookieName) {
  cookieName = cookieName + '='
  var cookieData = document.cookie
  var start = cookieData.indexOf(cookieName)
  var cookieValue = ''
  if (start !== -1) {
    start += cookieName.length
    var end = cookieData.indexOf(';', start)
    if (end === -1) {
      end = cookieData.length
    }
    cookieValue = cookieData.substring(start, end)
  }
  return unescape(cookieValue)
}

/*******************************************************
 * 쿠키저장
 * @param   : {String} cookieName
 * @param   : {String} value
 * @param   : {String} expireDays
 * @returns : N/A
 *******************************************************/
export function setCookie (cookieName, value, expireDays) {
  var expireDate = new Date()
  expireDate.setDate(expireDate.getDate() + expireDays)
  var cookieValue = escape(value) + ((expireDays === null) ? '' : '; expires=' + expireDate.toGMTString())
  document.cookie = cookieName + '=' + cookieValue
}

/*******************************************************
 * 쿠키삭제
 * @param   : {String} cookieName
 * @returns : N/A
 *******************************************************/
export function removeCookie (cookieName) {
  var expireDate = new Date()
  expireDate.setDate(expireDate.getDate() - 1)
  document.cookie = cookieName + '= ; expires=' + expireDate.toGMTString()
}

// export function goVuePage (url) {
//   router.push(url)
// }

// export function goBack () {
//   router.go(-1)
// }

// export function goPage (args) {
//   let url = args.url
//   let obj = !isNull(args.obj) ? args.obj : null
//   let params = !isNull(args.params) ? args.params : null

//   setCurrPage(obj, params)

//   store.commit('setCurrentPage', url)
//   router.push(url)
// }

export function setParamObj (obj) {
  let pObj = JSON.parse(localStorage.getItem('paramObj'))
  let searchParam = obj.searchParam

  if (searchParam) {
    for (let i in pObj) {
      searchParam[i] = pObj[i]
    }
  }
}

/*
 * 현재페이지 정보 저장.
 */
export function setCurrPage (obj, params) {
  let pathName = window.location.pathname

  // 현재 페이지 path('/', '#' 삭제)
  pathName = pathName.split('/').join('')
  pathName = pathName.split('#').join('')

  obj.$store.commit('setBeforeListPage', pathName)
  obj.$store.commit('setBeforeListParams', params)
}

/*
 * 현재페이지 정보 삭제.
 */
export function clearCurrPage () {
  this.$store.commit('setBeforeListPage', '')
  this.$store.commit('setBeforeListParams', {})
}

/*
 * null or '' Check
 */
export function isNull (str) {
  if (str === undefined || str == null || str === '') {
    return true
  }

  return false
}

/*
 * null or '' String 변환
 */
export function nullToString (args) {
  let str = args.str
  let chg = !isNull(args.chg) ? args.chg : ''

  if (str === undefined || str == null || str === '') {
    return chg
  }

  return str
}

/*
 * ID Check : 5-25자 이내
 */
export function isId (id) {
  if (id.length >= 5 && id.length <= 25) {
    return true
  } else {
    return false
  }
}

/*
 * password Check : 영문/숫자/특수문자 조합 8-16자 이내
 */
export function isPassword (pwd) {
  let num = pwd.search(/[0-9]/g)
  let eng = pwd.search(/[a-z]/gi)
  let spe = pwd.search(/[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi)

  if (pwd.length >= 8 && pwd.length <= 16 && eng >= 0 && num >= 0 && spe >= 0) {
    return true
  } else {
    return false
  }
}

/*
 * email Check
 */
export function isEmail (str) {
  if (str == null || str === '') {
    return false
  }
  // let pattern = /([\w-\\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/
  let pattern = /^(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()\\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  if (pattern.test(str)) {
    return true
  } else {
    return false
  }
}

/*
 * 사업자번호 Check
 */
export function isCorp (str) {
  if (str == null || str === '') {
    return false
  }

  let data = str.replace(/[^\d]/g, '')

  if (data.length !== 10) {
    return false
  }

  let comp = new Array(9)
  let stnd = new Array(8)
  let strStnd = '137137135'

  for (let i = 0; i < 10; i++) {
    comp[i] = data.substring(i, i + 1)
  }

  for (let i = 0; i < 9; i++) {
    stnd[i] = strStnd.substring(i, i + 1)
  }

  let sum = 0

  for (let i = 0; i < 9; i++) {
    sum += comp[i] * stnd[i]
  }

  sum = sum + parseInt((data.substring(8, 9) * 5) / 10)

  let mod = 10 - (sum % 10)

  if (mod >= 10) {
    mod -= 10
  }

  if (mod.toString() === comp[9]) {
    return true
  } else {
    return false
  }
}

/*
 * 입력 Event Key Control !!
 * param1 (필수) : obj   ==> this
 * param2 (필수) : eTagt ==> Event Target
 * param3 (선택) : op    ==> num : number 만 입력 가능 (default : num)
 *                            id : English, number, Underbar, Hyphen 만 입력 가능
 *                         email : English, number, Underbar, Hyphen, Comma, At 만 입력 가능
 */
export function onKeyControl (obj, eTagt, op) {
  let ref = eTagt.name // Event Target
  let val = eTagt.value // Event Target
  let opt = isNull(op) ? 'num' : op // Option : num(default), id, email
  let sTagtObj = obj.$refs[ref] // Setting Target

  if (opt === 'num') {
    val = val.replace(/[^0-9]/g, '')
  } else if (opt === 'id') {
    val = val.replace(/[^0-9a-zA-Z_-]/g, '')
  } else if (opt === 'email') {
    val = val.replace(/[^0-9a-zA-Z_-\s@\\.]/g, '')
  }

  if (!isNull(opt)) {
    sTagtObj.value = val
  }
}

/*
 * 입력 Event Key Control !!
 * param1 (필수) : obj   ==> this
 * param2 (필수) : eTagt ==> Event Target
 * param3 (선택) : op    ==> num : number 만 입력 가능 (default : num)
 *                            id : English, number, Underbar, Hyphen 만 입력 가능
 *                         email : English, number, Underbar, Hyphen, Comma, At 만 입력 가능
 * param4 (선택) : yn    ==> State Value Y/N (default : N)
 */
export function onKeyControlBlur (obj, eTagt, op, yn) {
  let sttYn = !isNull(yn) ? yn : 'N' // State Value Y/N

  let ref = eTagt.name // Event Target
  let val = sttYn === 'Y' ? obj.searchParam[ref] : obj[ref] // Value
  let opt = isNull(op) ? 'num' : op // Option : num(default), id, email

  if (opt === 'num') {
    val = val.replace(/[^0-9]/g, '')
  } else if (opt === 'id') {
    val = val.replace(/[^0-9a-zA-Z_-]/g, '')
  } else if (opt === 'email') {
    val = val.replace(/[^0-9a-zA-Z_-\s@\\.]/g, '')
  }

  if (!isNull(opt)) {
    if (sttYn === 'Y') {
      obj.searchParam[ref] = val
    } else {
      obj[ref] = val
    }
  }
}

/*
 * 현재일자 String 반환. ex) 20190301
 */
export function getToday () {
  let now = new Date()

  let year = now.getFullYear()
  let month = now.getMonth() + 1
  let day = now.getDate()

  month = month < 10 ? ('0' + month) : month.toString()
  day = day < 10 ? ('0' + day) : day.toString()

  return (year.toString() + month + day)
}

/*
 * 문자열 날짜를 입력받아 Date 형의 객체를 구함.
 */
export function getDate (str) {
  let arrDate = null

  if (isNull(str)) {
    return ''
  } else {
    str = str.replace(/\./gi, '').replace(/\//gi, '')

    arrDate = str.split('-')

    if (arrDate.length !== 3) {
      return str
    }

    let year = Number(arrDate[0])
    let month = Number(arrDate[1])
    let day = Number(arrDate[2])

    return new Date(year, month - 1, day)
  }
}

/*
 * Date 계산. ex) calDate('20190301', 'y', -1)
 */
export function calDate (str, filter, add) {
  let date = getDate(getDateFormat({str: str}))

  let year = date.getFullYear()
  let month = date.getMonth()
  let day = date.getDate()

  if (filter === 'y') {
    year += add
  } else if (filter === 'm') {
    month += add
  } else if (filter === 'd') {
    day += add
  }

  return getDateStr(new Date(year, month, day))
}

/*
 * Date형 날짜를 입력받아 문자열 날짜를 구함.
 */
export function getDateStr (date) {
  let year = ''
  let month = ''
  let day = ''

  if (date !== '') {
    year = date.getFullYear()
    month = date.getMonth() + 1
    day = date.getDate()

    if (('' + month).length === 1) { month = '0' + month }
    if (('' + day).length === 1) { day = '0' + day }
  }

  return ('' + year + month + day)
}

/*
 * 문자열 날짜를 입력받아 format. ex) 20190301 ==> 2019-03-01
 */
export function getDateFormat (args) {
  let str = args.str

  if (str == null || str === '') {
    return ''
  } else {
    str = str.replace(/[^\d]/g, '')

    let prefix = !isNull(args.prefix) ? args.prefix : '-'

    let mask = ''

    if (str.length === 4) {
      mask = '9999'
    } else if (str.length === 6) {
      mask = '9999' + prefix + '99'
    } else {
      mask = '9999' + prefix + '99' + prefix + '99'
    }

    return toMask(str, mask)
  }
}

/*
 * Format Mask
 */
export function toMask (str, mask) {
  let data = str.replace(/[^a-z|^A-Z|^\d]/g, '')
  let len = data.length
  let result = ''
  let j = 0

  for (let i = 0; i < len; i++) {
    result += data.charAt(i)

    j++

    if (j < mask.length && '-:|/.'.indexOf(mask.charAt(j)) !== -1) {
      result += mask.charAt(j++)
    }
  }

  return result
}

/*
 * 달력에 해당 기간코드에 맞는 날짜로 데이터 세팅 (1W, 1M, 3M)
 */
export function setDateByTerm (obj, typeCd) {
  let today = getToday()
  let strtDt = ''

  if (typeCd === '1W') {
    strtDt = calDate(today, 'd', -7)
  } else if (typeCd === '1M') {
    strtDt = calDate(today, 'm', -1)
  } else {
    strtDt = calDate(today, 'm', -3)
  }

  obj.setDate(getDateFormat({str: strtDt}), getDateFormat({str: today}))
}

/*
 * 전화번호 Format
 */
export function toTel (str) {
  let data = str.replace(/[^\d]/g, '')

  let mask = ''

  if (data.substr(0, 2) === '02') {
    mask = data.length === 9 ? '99-999-9999' : '99-9999-9999'
  } else {
    if (data.length === 8) {
      mask = '9999-9999'
    } else if (data.length === 10) {
      mask = '999-999-9999'
    } else if (data.length === 11) {
      mask = '999-9999-9999'
    } else {
      mask = '9999-9999-9999'
    }
  }

  return toMask(data, mask)
}

/*
 * 전화번호 체크
 */
export function isTel (str) {
  if (str == null || str === '') {
    return false
  }

  let pattern = /^(01[016789]{1}|070|02|0[3-9]{1}[0-9]{1})[0-9]{3,4}[0-9]{4}$/

  if (pattern.test(str)) {
    return true
  } else {
    return false
  }
}

/*
 * true, false -> Y, N 변환
 */
export function setYn (str) {
  if (str) {
    return 'Y'
  } else {
    return 'N'
  }
}

/*
 * Y, N -> true, false 변환
 */
export function setTrueFalse (str) {
  if (str === 'Y') {
    return true
  } else {
    return false
  }
}

/*
 * byte 체크 (문자열, 최대 입력 byte)
 */
export function chkByte (str, maxByte) {
  var byte = 0
  for (var i = 0; i < str.length; ++i) {
    // 기본 한글 2바이트 처리
    (str.charCodeAt(i) > 127) ? byte += 2 : byte++
    if (byte > maxByte) {
      Vue.swal({html: '최대 ' + maxByte + 'byte 까지 입력 가능합니다.</br>현재 ' + byte + 'byte 입니다.', type: 'info', confirmButtonText: '확인'})
      str = str.substr(0, i)
      break
    }
  }
  return str
}

/*
 * IE browser check
 */
export function checkIeBrowser () {
  let agent = navigator.userAgent.toLowerCase()
  let isIe = false
  if ((navigator.appName === 'Netscape' && agent.indexOf('trident') !== -1) || (agent.indexOf('msie') !== -1)) {
    isIe = true
  }
  return isIe
}

/***************************************************************
 * File 관련 함수
 **************************************************************/
/*
 * 파일 확장자 validation
 */
export function chkFileExte (file, fileType) {
  var fileExte = file.name.split('.')[file.name.split('.').length - 1]
  var chkExte = ''
  if (fileType === 'img') {
    chkExte = 'jpg,png,pdf'.split(',')
  } else if (fileType === 'doc') {
    chkExte = 'psd,doc,docx,xls,xlsx,ppt,pptx,pdf,hwp,hwpx,txt'.split(',')
  } else if (fileType === 'img_drt') {
    chkExte = 'jpg,png,gif,jpeg,JPG,PNG,GIF,JPEG'.split(',')
  } else {
    chkExte = 'jpg,gif,png,bmp,psd,doc,docx,xls,xlsx,ppt,pptx,pdf,hwp,hwpx,txt,rtf,zip,alz,egg,rar,7z'.split(',')
  }
  if (chkExte.indexOf(fileExte) < 0) {
    Vue.swal({text: '허용되지 않는 파일 형식입니다.', type: 'info', confirmButtonText: '확인'})
    return false
  }
  return true
}

export function onChangeImg (obj, e, idx) {
  let files = e.target.files || e.dataTransfer.files

  if (!files.length) {
    return false
  }

  idx = isNull(idx) ? 0 : idx
  /* 
  if (!chkFileExte(files[0], 'img')) {
    obj.drtImgList[idx].imgFlag = 'R'
    obj.drtImgList[idx].lgcFileNm = ''
    obj.drtImgList[idx].phcFileNm = ''
    obj.drtImgList[idx].fileSize = 0
    e.target.value = ''
    return false
  }
  */
  if (!chkFileExte(files[0], 'img_drt')) {
    obj.drtImgList[idx].imgFlag = 'R'
    obj.drtImgList[idx].lgcFileNm = ''
    obj.drtImgList[idx].phcFileNm = ''
    obj.drtImgList[idx].fileSize = 0
    e.target.value = ''
    return false
  }
  onCreateImg(obj, files[0], idx)
}

function onCreateImg (obj, file, idx) {
  let reader = new FileReader()

  reader.onload = (e) => {
    obj.drtImgList[idx].fullFilePath = e.target.result
  }

  reader.readAsDataURL(file)

  // File Upload Submit
  let formData = new FormData()

  formData.append('uploadFile', file)

  http.uploadPost('/addComSingleFile', formData, '', 'MAIN')
    .then(result => {
      let fileInfo = result.data.data.fileInfo

      obj.drtImgList[idx].imgFlag = 'C'
      obj.drtImgList[idx].lgcFileNm = fileInfo.lgcFileNm
      obj.drtImgList[idx].phcFileNm = fileInfo.phcFileNm
      obj.drtImgList[idx].fileSize = fileInfo.fileSize
    })
    .catch(result => {
      alert(nullToString({str: result.meta.userMessage, chg: '파일 업로드에 실패 하였습니다.'}))
    })
}

export function onRemoveImg (obj, idx) {
  let fileInfo = obj.imgList[idx]

  if (fileInfo == null) {
    return false
  }

  http.post('/delComSingleFile', fileInfo, '', 'MAIN')
    .then(result => {
      obj.imgList[idx].imgFlag = 'R'
      obj.imgList[idx].fileSeq = ''
      obj.imgList[idx].lgcFileNm = ''
      obj.imgList[idx].phcFileNm = ''
      obj.imgList[idx].fileSize = ''
      obj.imgList[idx].fullFilePath = ''
    })
    .catch(result => {
      alert('파일 삭제에 실패 하였습니다.')
    })
}

export function onRemoveFile (obj, idx) {
  idx = isNull(idx) ? 0 : idx
  let fileInfo = obj.fileList[idx]

  if (fileInfo == null) {
    return false
  }

  fileInfo.ifScnCd = 'unacc'

  http.post('/delComSingleFile', fileInfo, '', 'MAIN')
    .then(result => {
      obj.fileList[idx].imgFlag = 'R'
      obj.fileList[idx].fileSeq = ''
      obj.fileList[idx].lgcFileNm = ''
      obj.fileList[idx].phcFileNm = ''
      obj.fileList[idx].fileSize = ''
      obj.fileList[idx].fullFilePath = ''
    })
    .catch(result => {
      alert('파일 삭제에 실패 하였습니다.')
    })
}

export function onChangeFile (obj, e, idx) {
  let files = e.target.files || e.dataTransfer.files

  if (!files.length) {
    return false
  }

  idx = isNull(idx) ? 0 : idx

  if (!chkFileExte(files[0])) {
    obj.fileList[idx].imgFlag = 'R'
    obj.fileList[idx].lgcFileNm = ''
    obj.fileList[idx].phcFileNm = ''
    obj.fileList[idx].fileSize = 0
    e.target.value = ''
    return false
  }

  // File Upload Submit
  let formData = new FormData()

  formData.append('uploadFile', files[0])
  formData.append('ifScnCd', 'unacc')

  http.uploadPost('/addComSingleFile', formData, '', 'MAIN')
    .then(result => {
      let fileInfo = result.data.data.fileInfo

      obj.fileList[idx].imgFlag = 'C'
      obj.fileList[idx].lgcFileNm = fileInfo.lgcFileNm
      obj.fileList[idx].phcFileNm = fileInfo.phcFileNm
      obj.fileList[idx].fileSize = fileInfo.fileSize
    })
    .catch(result => {
      alert(nullToString({str: result.meta.userMessage, chg: '파일 업로드에 실패 하였습니다.'}))
    })
}

/*
 * File Download
 */
export function downComSingleFile (fileInfo, fileName) {
  http.post('/chkDownComSingleFile', fileInfo, '', 'MAIN')
    .then(result => {
      let existYn = result.data.data.existYn

      if (existYn === 'Y') {
        http.post('/downComSingleFile', fileInfo, 'blob', 'MAIN')
          .then((response) => {
            let downFileNm = ''
            let requestData = JSON.parse(response.config.data)
            let blobData = new Blob([response.data], { type: response.headers['content-type'] })

            if (!isNull(fileName)) {
              downFileNm = fileName
            } else {
              if (!isNull(requestData.logcFileNm)) {
                downFileNm = requestData.logcFileNm
              }
            }

            if (isNull(downFileNm)) {
              alert('다운로드할 파일명이 존재하지 않습니다.')
              return false
            }

            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
              window.navigator.msSaveOrOpenBlob(blobData, downFileNm) // ID10+
            } else {
              let link = document.createElement('a')
              let url = window.URL.createObjectURL(blobData)

              link.href = url
              link.setAttribute('download', downFileNm)

              document.body.appendChild(link)

              link.click()
            }
          })
          .catch((result) => {
            alert('파일 다운로드시 에러가 발생했습니다.')
            return false
          })
      } else {
        alert('파일이 존재하지 않습니다.')
        return false
      }
    })
    .catch((result) => {
      alert('파일 다운로드 체크시 에러가 발생했습니다.')
      return false
    })
}

/*
 * 저장 공통 체크
 */
export function isChkDataInfo (dataObj, scnCd) {
  for (let key in dataObj) {
    scnCd = isNull(scnCd) ? 'id' : scnCd
    scnCd = scnCd.toUpperCase()

    let contObj = scnCd === 'ID' ? document.getElementById(key) : document.getElementsByName(key)[0]
    console.log('contObj = ' + contObj)

    if (!isNull(contObj)) {
      let pantTdObj = getClosest(contObj, 'td')
      let fieldTxt = pantTdObj.previousElementSibling.innerText
      console.log('fieldTxt = ' + fieldTxt)
      fieldTxt = fieldTxt.replace('*', '').replace('필수항목', '')

      let required = contObj.getAttribute('required')
      let mxlength = contObj.getAttribute('maxlength')
      let focusId = contObj.getAttribute('focusId')
      let dataVal = dataObj[key]
      console.log('dataVal = ' + dataVal)

      if (!isNull(required) && required === 'required') {
        if (isNull(dataVal)) {
          alert(fieldTxt + '(은)는 필수 ' + (isNull(mxlength) ? '선택' : '입력') + '입니다.')

          if (!isNull(focusId)) {
            let focusObj = document.getElementById(focusId)

            if (!isNull(focusObj)) {
              focusObj.focus()
            }
          } else {
            contObj.focus()
          }

          return false
        }
      }

      if (!isNull(mxlength)) {
        let dataLen = getStrByte(dataVal)

        if (dataLen > mxlength) {
          alert(fieldTxt + '의 입력 초과입니다. ' + mxlength + ' byte 이내로 입력해주세요.')
          contObj.focus()
          return false
        }
      }
    }
  }

  return true
}

/*
 * Parent Node Search
 */
export function getClosest (currObj, srchTagNm) {
  let pantObj = currObj.parentNode
  console.log('pantObj = ' + pantObj)

  if (isNull(pantObj) || isNull(srchTagNm)) {
    return null
  }

  let pantTagNm = pantObj.tagName
  console.log('pantTagNm = ' + pantTagNm)
  console.log('srchTagNm = ' + srchTagNm)

  if (pantTagNm.toUpperCase === srchTagNm.toUpperCase) {
    return pantObj
  } else {
    return getClosest(pantObj, srchTagNm)
  }
}

/*
 * Byte Count
 */
export function getStrByte (str) {
  let byte = 2 // default count 2

  if (isNull(str)) {
    return 0
  }

  let cnt = 0

  for (let i = 0; i < str.length; i++) {
    if (str.substr(i, 1) > String.fromCharCode('255')) {
      cnt = cnt + byte
    } else {
      cnt++
    }
  }

  return cnt
}
