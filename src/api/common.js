import {get,post,upload} from '@/utils/request'
// 阿里云上传图片（漫画封面）
export const uploadFile = (data) => upload('/api/ali/uploadFile',data)