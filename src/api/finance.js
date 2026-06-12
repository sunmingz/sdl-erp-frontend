import request from './index'

export const getFinanceStats = () => {
  return request({
    url: '/api/finance/stats',
    method: 'get'
  })
}
