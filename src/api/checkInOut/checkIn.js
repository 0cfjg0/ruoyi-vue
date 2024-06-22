import request from '@/utils/request'

// 查询checkIn列表
export function listCheckIn(query) {
  return request({
    url: '/checkInOut/checkIn/list',
    method: 'get',
    params: query
  })
}

// 查询checkIn详细
export function getCheckIn(id) {
  return request({
    url: '/checkInOut/checkIn/' + id,
    method: 'get'
  })
}

// 新增checkIn
export function addCheckIn(data) {
  return request({
    url: '/checkInOut/checkIn',
    method: 'post',
    data: data
  })
}

// 修改checkIn
export function updateCheckIn(data) {
  return request({
    url: '/checkInOut/checkIn',
    method: 'put',
    data: data
  })
}

// 删除checkIn
export function delCheckIn(id) {
  return request({
    url: '/checkInOut/checkIn/' + id,
    method: 'delete'
  })
}
