import request from './index'

export function getMenuTree() {
  return request({
    url: '/api/menu/tree',
    method: 'get'
  })
}

export function getAllMenus() {
  return request({
    url: '/api/menu/all',
    method: 'get'
  })
}

export function getMenuById(id) {
  return request({
    url: `/api/menu/${id}`,
    method: 'get'
  })
}

export function createMenu(data) {
  return request({
    url: '/api/menu',
    method: 'post',
    data
  })
}

export function updateMenu(id, data) {
  return request({
    url: `/api/menu/${id}`,
    method: 'put',
    data
  })
}

export function deleteMenu(id) {
  return request({
    url: `/api/menu/${id}`,
    method: 'delete'
  })
}

export function getMenusByRole(roleId) {
  return request({
    url: `/api/menu/role/${roleId}`,
    method: 'get'
  })
}

export function saveRoleMenus(roleId, menuIds) {
  return request({
    url: `/api/menu/role/${roleId}`,
    method: 'post',
    data: { menuIds }
  })
}

export function getPermissionsByRole(roleId) {
  return request({
    url: `/api/menu/role/${roleId}/permissions`,
    method: 'get'
  })
}
