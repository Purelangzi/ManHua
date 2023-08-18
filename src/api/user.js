import axios from '@/utils/request'

export const login = (data) => axios.post('/user/login', data)

export const register = (data) => axios.post('/user/reg', data)
