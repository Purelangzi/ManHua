import {get,post} from '@/utils/request'
// 获取小说分类数据
export const getCategory = (params) =>get('/api/novel/getCtcategory',params)
// 添加小说分类
export const addCategory = (data) =>post('/api/novel/addCategory',data)
// 修改小说分类
export const updateCategory = (data) =>post('/api/novel/editCtcategory',data)
//  删除小说分类
export const deleteCategory = (data) =>post('/api/novel/deleteCtcategory',data)

