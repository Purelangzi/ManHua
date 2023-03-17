import {get,post,upload} from '@/utils/request'
// 阿里云上传图片（漫画封面）
export const uploadFile = (data) => upload('/api/ali/uploadFile',data)
// 采集小说详情
export const  queryNovelDetail = (data) => post('/api/queryNovelDetail',data)
// 采集视频详情
export const  queryVideolDetail = (data) => post('/api/queryVideolDetail',data)