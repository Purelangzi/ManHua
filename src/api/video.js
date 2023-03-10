import {get,post} from '@/utils/request'
// 获取视频分类
export const getCategory = (params) => get('/api/video/getCtcategory',params)
// 添加小说分类
export const addCategory = (data) =>post('/api/video/addCategory',data)
// 修改小说分类
export const updateCategory = (data) =>post('/api/video/editCtcategory',data)
//  删除小说分类
export const deleteCategory = (data) =>post('/api/video/deleteCtcategory',data)