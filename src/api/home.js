import request from '@/utils/request'
// 首页动画列表
/* export const getCartoonList = (params) =>request({
    url:'/api/product/getCartoonList',
    method:'get',
    params:params
}) */
export const getCartoonList = (params) =>request.get('/api/product/getCartoonList',{params})