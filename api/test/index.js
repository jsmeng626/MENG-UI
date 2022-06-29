import request from '@/utils/http'
const api = {}

api.getInfo = params => request('get', 'ment/AdminUser/anz/login', params)

export default api