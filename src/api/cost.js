import request from './index'

export const getExpenseList = (params) => {
  return request({
    url: '/api/cost/expense/list',
    method: 'get',
    params
  })
}

export const createExpense = (data) => {
  return request({
    url: '/api/cost/expense',
    method: 'post',
    data
  })
}

export const updateExpense = (id, data) => {
  return request({
    url: `/api/cost/expense/${id}`,
    method: 'put',
    data
  })
}

export const deleteExpense = (id) => {
  return request({
    url: `/api/cost/expense/${id}`,
    method: 'delete'
  })
}

export const getVoucherList = (params) => {
  return request({
    url: '/api/cost/voucher/list',
    method: 'get',
    params
  })
}

export const createVoucher = (data) => {
  return request({
    url: '/api/cost/voucher',
    method: 'post',
    data
  })
}

export const deleteVoucher = (id) => {
  return request({
    url: `/api/cost/voucher/${id}`,
    method: 'delete'
  })
}

export const postVoucher = (id) => {
  return request({
    url: `/api/cost/voucher/${id}/post`,
    method: 'post'
  })
}