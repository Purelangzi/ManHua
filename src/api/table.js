import axios from '@/utils/request'

export function getList(params) {
  return axios.get('/vue-admin-template/table/list', params)
}
