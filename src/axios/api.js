import fetch from "../axios/index"
import env from '../../build/env'


/*
*通用API接口
* url:请求路径
* method：请求方法（post\get\delete）
* data：请求对象
 */

let host = env === 'development' ? '' : 'http://10.77.1.138:7101/';
let prefix = env === 'development'?'sss':'';
let url = host + prefix
export function apiFetch(api) {
  return fetch({
    baseURL: url,
    url:api.url,
    method:api.method,
    data:api.data,
    responseType:api.responseType,
  });
}
