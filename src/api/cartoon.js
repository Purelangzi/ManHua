import request from '@/utils/request'
// 获取漫画分类
export const getCategory = (params) =>request.get('/api/product/getCtcategory',{params})