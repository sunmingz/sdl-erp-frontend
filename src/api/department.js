import request from './index'

export function getDepartmentTree() {
  return request({
    url: '/api/department/tree',
    method: 'get'
  })
}

export function getDepartmentList(params) {
  return request({
    url: '/api/department/list',
    method: 'get',
    params
  })
}

export function getAllDepartments() {
  return request({
    url: '/api/department/all',
    method: 'get'
  })
}

export function getActiveDepartments() {
  return request({
    url: '/api/department/active',
    method: 'get'
  })
}

export function getDepartmentById(id) {
  return request({
    url: `/api/department/${id}`,
    method: 'get'
  })
}

export function createDepartment(data) {
  return request({
    url: '/api/department',
    method: 'post',
    data
  })
}

export function updateDepartment(id, data) {
  return request({
    url: `/api/department/${id}`,
    method: 'put',
    data
  })
}

export function deleteDepartment(id) {
  return request({
    url: `/api/department/${id}`,
    method: 'delete'
  })
}
