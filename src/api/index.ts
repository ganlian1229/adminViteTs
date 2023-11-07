import { get, post } from '@/api/request';
/**
 * @description: 测试请求
 * @param {*} url
 * @param {*} params
 * @return {*}
 */
export function testApi(params) {
    return get('http://10.100.31.150/auth/login', params);
}
