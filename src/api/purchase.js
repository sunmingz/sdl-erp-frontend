import request from './index'

export const getPurchaseOrderList = (params) => {
  return request({
    url: '/api/purchase/list',
    method: 'get',
    params
  })
}

export const getPurchaseOrderById = (id) => {
  return request({
    url: `/api/purchase/${id}`,
    method: 'get'
  })
}

export const createPurchaseOrder = (data) => {
  return request({
    url: '/api/purchase',
    method: 'post',
    data
  })
}

export const updatePurchaseOrder = (id, data) => {
  return request({
    url: `/api/purchase/${id}`,
    method: 'put',
    data
  })
}

export const submitPurchaseOrder = (id) => {
  return request({
    url: `/api/purchase/${id}/submit`,
    method: 'post'
  })
}

export const approvePurchaseOrder = (id) => {
  return request({
    url: `/api/purchase/${id}/approve`,
    method: 'post'
  })
}

export const rejectPurchaseOrder = (id) => {
  return request({
    url: `/api/purchase/${id}/reject`,
    method: 'post'
  })
}

export const deletePurchaseOrder = (id) => {
  return request({
    url: `/api/purchase/${id}`,
    method: 'delete'
  })
}
