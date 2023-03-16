import {get,post} from '@/utils/request'
// 获取小说分类数据
export const getCategory = (params) =>get('/api/novel/getCtcategory',params)
// 添加小说分类
export const addCategory = (data) =>post('/api/novel/addCategory',data)
// 修改小说分类
export const updateCategory = (data) =>post('/api/novel/editCtcategory',data)
//  删除小说分类
export const deleteCategory = (data) =>post('/api/novel/deleteCtcategory',data)


// 获取小说列表
export const getList = (params) =>get('/api/novel/getCartoonList',params)
// 删除小说
export const deleteList = (data) => post('/api/novel/deleteCartoon',data)
// 修改小说详情
export const updateList = (data) => post('/api/novel/editCartoon',data)
// 添加小说
export const addList = (data) => post('/api/novel/addCartoon',data)
// 添加小说章节 
export const addChapter = (data) => post('/api/novel/addChapter',data)
// 获取小说详情
export const getDetail = (params) =>get('/api/novel/getCartoonDetail',params)
// 获取小说章节列表
export const getChapterList = (params) => get('/api/novel/getChapterList',params)
// 修改小说章节信息
export const editChapter = (data) => post('/api/novel/editChapter',data)
// 删除小说章节
export const deleteChapter = (data) => post('/api/novel/deleteChapter',data)