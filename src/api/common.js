import {post,upload} from '@/utils/request'
// 阿里云上传图片（漫画封面）
export const uploadFile = (data) => upload('/api/ali/uploadFile',data)
// 采集小说详情
export const queryNovelDetail = (data) => post('/api/queryNovelDetail',data)
// 采集视频详情
export const queryVideolDetail = (data) => post('/api/queryVideolDetail',data)
// 采集漫画详情 
export const queryDetailById = (data) => post('/api/queryDetailById',data)

// 采集漫画链接 
export const getCartoonLink = (data) =>post('/api/getCartoonLink',data)
// 采集小说链接 
export const getNovelLink = (data) =>post('/api/getNovelLink',data)
// 采集视频链接 
export const getVideoLink = (data) =>post('/api/getVideoLink',data)