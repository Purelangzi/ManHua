import {get,post} from '@/utils/request'
// 获取视频分类
export const getCategory = (params) => get('/api/video/getCtcategory',params)
// 添加视频分类
export const addCategory = (data) =>post('/api/video/addCategory',data)
// 修改视频分类
export const updateCategory = (data) =>post('/api/video/editCtcategory',data)
//  删除视频分类
export const deleteCategory = (data) =>post('/api/video/deleteCtcategory',data)





// 获取视频列表
export const getList = (params) =>get('/api/video/getCartoonList',params)
// 删除视频
export const deleteList = (data) => post('/api/video/deleteCartoon',data)
// 修改视频详情
export const updateList = (data) => post('/api/video/editCartoon',data)
// 添加视频
export const addList = (data) => post('/api/video/addCartoon',data)
// 添加视频章节 
export const addChapter = (data) => post('/api/video/addChapter',data)
// 获取视频详情
export const getDetail = (params) =>get('/api/video/getCartoonDetail',params)
// 获取视频章节列表
export const getChapterList = (params) => get('/api/video/getChapterList',params)
// 修改视频章节信息
export const editChapter = (data) => post('/api/video/editChapter',data)
// 删除视频章节
export const deleteChapter = (data) => post('/api/video/deleteChapter',data)