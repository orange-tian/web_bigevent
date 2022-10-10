$(function () {
    getUserInfo()
})

function getUserInfo() {
    $.ajax({
        method: 'get',
        url: '/my/userinfo',
        // 请求头配置对象
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            // console.log(res)
            if (res.status !== 0) {
                return layer.msg('获取用户信息失败')
            }
            // 渲染用户的头像
            renderAvatar(res.data)
        }


    })
}

// 渲染用户头像
function renderAvatar(user) {
    // 获取用户的名称
    const name = user.nickname || user.username
    $('.welcome').html('欢迎&nbsp;&nbsp;' + name)
    // 按需渲染用户头像
    if (user.user_pic !== null) {
        // 渲染 用户自定义的头像
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        // 渲染 文字头像
        $('.layui-nav-img').hide()
        const first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}

// 退出功能
$('#btnLogout').click(function () {
    layer.confirm('是否确定退出', { icon: 3, title: '提示' }, function (index) {
        // 1 清除本地存储的token 
        localStorage.removeItem('token')
        // 2 跳转到登录页面
        location.href = './login.html'

        // 关闭 conform 询问框
        layer.close(index);
    });
})

