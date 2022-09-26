// 当调用 $.post $.get $.ajax 之前
// 都会自动调用 $.ajaxPrefilter()
$.ajaxPrefilter(function (options) {
    // 获取到 url 地址
    // console.log(options.url)
    // 把这个 地址 拼接上 完整的根路径
    options.url = 'http://www.liulongbin.top:3007' + options.url
    console.log(options.url)
})