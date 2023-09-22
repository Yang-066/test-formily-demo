import { Loading } from 'element-ui'
import { v4 as uuidv4 } from 'uuid'

/**
 * @description 下载文件
 * @param {*} method 下载文件的方法，返回axios对象
 * @param {*} params 下载文件的参数
 * @param {*} filename 文件名称，未填的话从response中取
 */
export const saveFile = async (method, params, filename) => {
  const loading = Loading.service({ text: '下载中...' })
  try {
    const res = await method(params)
    if (!res || (res.data && res.data.message)) {
      const data = {
        data: {
          message: ''
        }
      }
      data.data.message = !res ? '请求失败' : res.data.message
      return data
    } else {
      let fileName = filename
      if (!fileName) {
        const ContentDisposition = res.headers['content-disposition']
        fileName = decodeURIComponent(
          ContentDisposition.split('filename=').splice(-1)
        )
      }
      const data = new Blob([res.data])
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(data, fileName)
      } else {
        const url = window.URL.createObjectURL(data)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
      const resdata = {
        message: '下载成功'
      }
      return resdata
    }
  } catch (error) {
    this.$message.error(error)
  } finally {
    loading.close()
  }
}
export const desensitization = function (row) {
  if (row.length > 1) {
    return row.substring(0, 1) + '****' + row.substring(row.length - 1, row.length)
  } else {
    return '*'
  }
}

export const getCode = () => {
  const uuidToken = uuidv4()
  sessionStorage.setItem('submitCode', uuidToken)
}

export const formatDateTime = (value, type, showType) => {
  if (value == null) {
    return ''
  } else {
    const date = new Date(value)
    const y = date.getFullYear() // 年
    let MM = date.getMonth() + 1 // 月
    MM = MM < 10 ? '0' + MM : MM
    let d = date.getDate() // 日
    d = d < 10 ? '0' + d : d
    let h = date.getHours() // 时
    h = h < 10 ? '0' + h : h
    let m = date.getMinutes() // 分
    m = m < 10 ? '0' + m : m
    let s = date.getSeconds() // 秒
    s = s < 10 ? '0' + s : s
    if (type) {
      if (showType) {
        return y + '年' + MM + '月' + d + '日'
      } else {
        return y + '-' + MM + '-' + d
      }
    }
    return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s
  }
}
