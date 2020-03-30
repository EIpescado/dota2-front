const baseUrl = "/api"
const userUrl = baseUrl + "/user"

/**用户相关接口 */
export const USER_URL = {
    /**登录 */
    login : userUrl + "/login",
    /**注册 */
    register : userUrl + "/register",
    /**用户列表*/
    user_list : userUrl,
    /**用户激活*/
    user_activate : userUrl + "/activate",
    /**用户分配接口权限*/
    user_allot : userUrl + "/allot",
    /**用户 删除*/
    user_delete : userUrl + "/disable/{id}",
    /**用户接口权限树 */
    user_right_tree : userUrl + "/tree",
    /**用户详情 */
    user_detail : userUrl + "/{id}",
    /**用户日志 */
    user_logs : userUrl + "/{id}/logs"
}

/**日志接口 */ 
export const LOG_URL = {
    /**日志 */
    logs : baseUrl + "/{urlPrefix}/{entityId}/logs",
}


/**数据字典接口 */
export const DICTIONARY_URL = {
    /**日志 */
    logs : baseUrl + "/{urlPrefix}/{entityId}/logs",
}

/**数据字典接口 */
export const REQUEST_LOG_URL = {
    /**列表 */
    request_list : baseUrl + "/requestLog",
    /**日志 */
    request_detail : baseUrl + "/requestLog/{requestId}",
    /**重调 */
    process: baseUrl + "/requestLog/{requestId}"
}


/**
 * 格式化url占位符
 * eg: http://localhost:8080/{id}/aaa/{name}
 * urlFormat(url, {id: '111', name: 'yc'})
 * @param url
 * @param param
 * @returns {*}
 */
export const urlFormat = (url, param) => {
    if (param === undefined || param === null || param === {}) {
        return url;
    }

    let keys = Object.keys(param);
    for (let key of keys) {
        url = url.replace(new RegExp("\\{" + key + "\\}", "g"), param[key]);
    }
    return url;
};

export default { USER_URL, LOG_URL,REQUEST_LOG_URL, urlFormat }