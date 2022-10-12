$(function () {
    const form = layui.form
    const layer = layui.layer
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度必须是1~6个字符'
            }
        }
    })

    initUserInfo()

    // 获取用户的信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败')
                }
                console.log(res)
                form.val('formUserInfo', res.data)
            }
        })
    }

    // 重置功能
    $('.btnReset').click(function (e) {
        // 阻止表单的默认提交行为
        e.preventDefault()
        // 再次调用 获取用户信息的 函数
        initUserInfo()
    })

    // 提交表单
    $('.layui-form').on('submit', function (e) {
        // 阻止表单的默认行为
        e.preventDefault()
        // 发起请求
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败')
                }
                layer.msg('更新用户信息成功')
                // 同时还要修改 头像和欢迎信息
                // 本质是获取 当前元素 iframe 的父级元素的方法
                window.parent.getUserInfo()
            }
        })
    })
})