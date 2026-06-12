import request from './index'

export const getRouteList = (params) => {
  return request({
    url: '/api/route/list',
    method: 'get',
    params
  })
}

export const getRouteById = (id) => {
  return request({
    url: `/api/route/${id}`,
    method: 'get'
  })
}

export const createRoute = (data) => {
  return request({
    url: '/api/route',
    method: 'post',
    data
  })
}

export const updateRoute = (id, data) => {
  return request({
    url: `/api/route/${id}`,
    method: 'put',
    data
  })
}

export const deleteRoute = (id) => {
  return request({
    url: `/api/route/${id}`,
    method: 'delete'
  })
}

export const addProcess = (routeId, data) => {
  return request({
    url: `/api/route/${routeId}/process`,
    method: 'post',
    data
  })
}

export const updateProcess = (routeId, processId, data) => {
  return request({
    url: `/api/route/${routeId}/process/${processId}`,
    method: 'put',
    data
  })
}

export const deleteProcess = (routeId, processId) => {
  return request({
    url: `/api/route/${routeId}/process/${processId}`,
    method: 'delete'
  })
}