import {get,post} from '@/utils/request'
// 获取漫画分类
export const getCategory = (params) =>get('/api/product/getCtcategory',params)
// 删除漫画分类
export const deleteCategory = (data) => post('/api/product/deleteCtcategory',data)
// 修改漫画分类
export const updateCategory = (data) => post('/api/product/editCtcategory',data)
// 添加漫画分类
export const addCategory = (data) => post('/api/cartoon/addCategory',data)

// 获取漫画列表
export const getList = (params) =>get('/api/product/getCartoonList',params)
// 删除漫画
export const deleteList = (data) => post('/api/product/deleteCartoon',data)
// 修改漫画详情
export const updateList = (data) => post('/api/product/editCartoon',data)
// 添加漫画
export const addList = (data) => post('/api/product/addCartoon',data)
// 添加漫画章节 
export const addChapter = (data) => post('/api/cartoon/addChapter',data)
// 获取漫画详情
export const getDetail = (params) =>get('/api/product/getCartoonDetail',params)
// 获取漫画章节列表
export const getChapterList = (params) => get('/api/cartoon/getChapterList',params)
