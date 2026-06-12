import request from './index'

export const getBOMList = (params) => {
  return request({
    url: '/api/bom/list',
    method: 'get',
    params
  })
}

export const getBOMById = (id) => {
  return request({
    url: `/api/bom/${id}`,
    method: 'get'
  })
}

export const createBOM = (data) => {
  return request({
    url: '/api/bom',
    method: 'post',
    data
  })
}

export const updateBOM = (id, data) => {
  return request({
    url: `/api/bom/${id}`,
    method: 'put',
    data
  })
}

export const deleteBOM = (id) => {
  return request({
    url: `/api/bom/${id}`,
    method: 'delete'
  })
}

export const addBOMItem = (bomId, data) => {
  return request({
    url: `/api/bom/${bomId}/item`,
    method: 'post',
    data
  })
}

export const updateBOMItem = (bomId, itemId, data) => {
  return request({
    url: `/api/bom/${bomId}/item/${itemId}`,
    method: 'put',
    data
  })
}

export const deleteBOMItem = (bomId, itemId) => {
  return request({
    url: `/api/bom/${bomId}/item/${itemId}`,
    method: 'delete'
  })
}