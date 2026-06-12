import request from './index'

export const getOrderList = (params) => {
  return request({
    url: '/api/order/list',
    method: 'get',
    params
  })
}

export const getOrderById = (id) => {
  return request({
    url: `/api/order/${id}`,
    method: 'get'
  })
}

export const createOrder = (data) => {
  return request({
    url: '/api/order',
    method: 'post',
    data
  })
}

export const updateOrder = (id, data) => {
  return request({
    url: `/api/order/${id}`,
    method: 'put',
    data
  })
}

export const deleteOrder = (id) => {
  return request({
    url: `/api/order/${id}`,
    method: 'delete'
  })
}

export const submitOrder = (id) => {
  return request({
    url: `/api/order/${id}/submit`,
    method: 'put'
  })
}

export const confirmOrder = (id) => {
  return request({
    url: `/api/order/${id}/confirm`,
    method: 'put'
  })
}

export const shipOrder = (id) => {
  return request({
    url: `/api/order/${id}/ship`,
    method: 'put'
  })
}

export const completeOrder = (id) => {
  return request({
    url: `/api/order/${id}/complete`,
    method: 'put'
  })
}

export const cancelOrder = (id) => {
  return request({
    url: `/api/order/${id}/cancel`,
    method: 'put'
  })
}
