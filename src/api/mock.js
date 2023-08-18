import axios from '@/utils/mockRequest'

// 采集视频链接不可用,mock
export const getMockVideoLink = () => axios.get('/getVideoLink')
