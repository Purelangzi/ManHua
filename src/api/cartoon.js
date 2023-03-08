import request from '@/utils/request'
// 获取漫画分类
export const getCategory = (params) =>request.get('/api/product/getCtcategory',{params})
// 删除漫画分类
export const deleteCategory = (data) => request.post('/api/product/deleteCtcategory',data)

