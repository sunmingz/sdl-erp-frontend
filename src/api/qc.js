import request from './index'

export const getQCList = (params) => {
  return request({
    url: '/api/qc/list',
    method: 'get',
    params
  })
}

export const getQCById = (id) => {
  return request({
    url: `/api/qc/${id}`,
    method: 'get'
  })
}

export const createQC = (data) => {
  return request({
    url: '/api/qc',
    method: 'post',
    data
  })
}

export const updateQC = (id, data) => {
  return request({
    url: `/api/qc/${id}`,
    method: 'put',
    data
  })
}

export const deleteQC = (id) => {
  return request({
    url: `/api/qc/${id}`,
    method: 'delete'
  })
}

export const submitQCResult = (id, data) => {
  return request({
    url: `/api/qc/${id}/result`,
    method: 'post',
    data
  })
}