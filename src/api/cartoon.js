import axios from '@/utils/request'
// 获取漫画分类
export const getCategory = (params) => axios.get('/api/product/getCtcategory', params)
// 删除漫画分类
export const deleteCategory = (data) => axios.post('/api/product/deleteCtcategory', data)
// 修改漫画分类
export const updateCategory = (data) => axios.post('/api/product/editCtcategory', data)
// 添加漫画分类
export const addCategory = (data) => axios.post('/api/cartoon/addCategory', data)

// 获取漫画列表
export const getList = (params) => axios.get('/api/product/getCartoonList', params)
// 删除漫画
export const deleteList = (data) => axios.post('/api/product/deleteCartoon', data)
// 修改漫画详情
export const updateList = (data) => axios.post('/api/product/editCartoon', data)
// 添加漫画
export const addList = (data) => axios.post('/api/product/addCartoon', data)
// 添加漫画章节
export const addChapter = (data) => axios.post('/api/cartoon/addChapter', data)
// 获取漫画详情
export const getDetail = (params) => axios.get('/api/product/getCartoonDetail', params)
// 获取漫画章节列表
export const getChapterList = (params) => axios.get('/api/cartoon/getChapterList', params)
