import {get,post} from '@/utils/request'
// 获取漫画分类
export const getCategory = (params) =>get('/api/product/getCtcategory',params)
// 删除漫画分类
export const deleteCategory = (data) => post('/api/product/deleteCtcategory',data)
// 修改漫画分类
export const updateCategory = (data) => post('/api/product/editCtcategory',data)
// 添加漫画分类
export const addCategory = (data) => post('/api/cartoon/addCategory',data)
