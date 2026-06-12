import request from './index'

export const getSalesOrderList = (params) => {
  return request({
    url: '/api/sales/list',
    method: 'get',
    params
  })
}

export const getSalesOrderById = (id) => {
  return request({
    url: `/api/sales/${id}`,
    method: 'get'
  })
}

export const createSalesOrder = (data) => {
  return request({
    url: '/api/sales',
    method: 'post',
    data
  })
}

export const updateSalesOrder = (id, data) => {
  return request({
    url: `/api/sales/${id}`,
    method: 'put',
    data
  })
}

export const shipSalesOrder = (id) => {
  return request({
    url: `/api/sales/${id}/ship`,
    method: 'post'
  })
}

export const completeSalesOrder = (id) => {
  return request({
    url: `/api/sales/${id}/complete`,
    method: 'post'
  })
}

export const deleteSalesOrder = (id) => {
  return request({
    url: `/api/sales/${id}`,
    method: 'delete'
  })
}
