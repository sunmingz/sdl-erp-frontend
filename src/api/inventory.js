import request from './index'

export const getInventoryList = (params) => {
  return request({
    url: '/api/inventory/list',
    method: 'get',
    params
  })
}

export const getInventoryById = (id) => {
  return request({
    url: `/api/inventory/${id}`,
    method: 'get'
  })
}

export const getInventoryByProductCode = (productCode) => {
  return request({
    url: `/api/inventory/product/${productCode}`,
    method: 'get'
  })
}

export const createStockIn = (data) => {
  return request({
    url: '/api/inventory/stock-in',
    method: 'post',
    data
  })
}

export const createStockOut = (data) => {
  return request({
    url: '/api/inventory/stock-out',
    method: 'post',
    data
  })
}

export const updateInventory = (id, data) => {
  return request({
    url: `/api/inventory/${id}`,
    method: 'put',
    data
  })
}

export const deleteInventory = (id) => {
  return request({
    url: `/api/inventory/${id}`,
    method: 'delete'
  })
}

export const adjustInventory = (id, data) => {
  return request({
    url: `/api/inventory/${id}/adjust`,
    method: 'post',
    data
  })
}
