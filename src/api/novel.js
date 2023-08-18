import axios from '@/utils/request'
// 获取小说分类数据
export const getCategory = (params) => axios.get('/api/novel/getCtcategory', params)
// 添加小说分类
export const addCategory = (data) => axios.post('/api/novel/addCategory', data)
// 修改小说分类
export const updateCategory = (data) => axios.post('/api/novel/editCtcategory', data)
//  删除小说分类
export const deleteCategory = (data) => axios.post('/api/novel/deleteCtcategory', data)

// 获取小说列表
export const getList = (params) => axios.get('/api/novel/getCartoonList', params)
// 删除小说
export const deleteList = (data) => axios.post('/api/novel/deleteCartoon', data)
// 修改小说详情
export const updateList = (data) => axios.post('/api/novel/editCartoon', data)
// 添加小说
export const addList = (data) => axios.post('/api/novel/addCartoon', data)
// 添加小说章节
export const addChapter = (data) => axios.post('/api/novel/addChapter', data)
// 获取小说详情
export const getDetail = (params) => axios.get('/api/novel/getCartoonDetail', params)
// 获取小说章节列表
export const getChapterList = (params) => axios.get('/api/novel/getChapterList', params)
// 修改小说章节信息
export const editChapter = (data) => axios.post('/api/novel/editChapter', data)
// 删除小说章节
export const deleteChapter = (data) => axios.post('/api/novel/deleteChapter', data)
