// 当调用 $.post $.get $.ajax 之前
// 都会自动调用 $.ajaxPrefilter()
$.ajaxPrefilter(function (options) {
    // 获取到 url 地址
    // console.log(options.url)
    // 把这个 地址 拼接上 完整的根路径
    options.url = 'http://www.liulongbin.top:3007' + options.url
    // console.log(options.url)


    // 判断接口是否是有权限的接口  有权限的接口要加 请求头 headers
    // indexof 判断是否有 该字符串 有则返回int数字 没有则返回 -1
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    // 统一挂载 complete 回调
    options.complete = function (res) {
        // console.log('调用了 complete 回调函数')
        // console.log(res)
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 1 清空本地 token
            localStorage.removeItem('token')
            // 2 强制跳转到 登录页
            location.href = '/login.html'
        }
    }


})