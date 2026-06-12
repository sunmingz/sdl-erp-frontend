import request from './index'

export const getProductionOrderList = (params) => {
  return request({
    url: '/api/production/list',
    method: 'get',
    params
  })
}

export const getProductionOrderById = (id) => {
  return request({
    url: `/api/production/${id}`,
    method: 'get'
  })
}

export const createProductionOrder = (data) => {
  return request({
    url: '/api/production',
    method: 'post',
    data
  })
}

export const updateProductionOrder = (id, data) => {
  return request({
    url: `/api/production/${id}`,
    method: 'put',
    data
  })
}

export const deleteProductionOrder = (id) => {
  return request({
    url: `/api/production/${id}`,
    method: 'delete'
  })
}

export const startProductionOrder = (id) => {
  return request({
    url: `/api/production/${id}/start`,
    method: 'post'
  })
}

export const reportProduction = (id, data) => {
  return request({
    url: `/api/production/${id}/report`,
    method: 'post',
    data
  })
}