import axios from '@/utils/request'
// 获取视频分类
export const getCategory = (params) => axios.get('/api/video/getCtcategory', params)
// 添加视频分类
export const addCategory = (data) => axios.post('/api/video/addCategory', data)
// 修改视频分类
export const updateCategory = (data) => axios.post('/api/video/editCtcategory', data)
//  删除视频分类
export const deleteCategory = (data) => axios.post('/api/video/deleteCtcategory', data)

// 获取视频列表
export const getList = (params) => axios.get('/api/video/getCartoonList', params)
// 删除视频
export const deleteList = (data) => axios.post('/api/video/deleteCartoon', data)
// 修改视频详情
export const updateList = (data) => axios.post('/api/video/editCartoon', data)
// 添加视频
export const addList = (data) => axios.post('/api/video/addCartoon', data)
// 添加视频章节
export const addChapter = (data) => axios.post('/api/video/addChapter', data)
// 获取视频详情
export const getDetail = (params) => axios.get('/api/video/getCartoonDetail', params)
// 获取视频章节列表
export const getChapterList = (params) => axios.get('/api/video/getChapterList', params)
// 修改视频章节信息
export const editChapter = (data) => axios.post('/api/video/editChapter', data)
// 删除视频章节
export const deleteChapter = (data) => axios.post('/api/video/deleteChapter', data)
