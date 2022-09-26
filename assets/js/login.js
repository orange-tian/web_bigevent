$(function () {
    // 去注册账号 的点击事件
    $('#link_reg').click(function () {
        $('.login-box').hide()
        $('.reg-box').show()
    })
    // 去登录 的点击事件
    $('#link_login').click(function () {
        $('.reg-box').hide()
        $('.login-box').show()
    })

    // 从layui中获取 form 对象
    const form = layui.form
    const layer = layui.layer
    // 自定义 验证规则
    form.verify({
        // 自定义了一个叫 pass 的规则 验证密码的
        pass: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        repass: function (value) {
            // 获取第一次输入的密码  和获取到的第二次的密码相比较
            // 不一致 则提示用户
            const pwd = $('.pwd_first').val()
            if (pwd !== value) {
                return '两次密码不一致'
            }
        }
    })

    // 监听注册表单的提交事件
    $('#form-reg').on('submit', function (e) {
        // 取消默认提交行为
        e.preventDefault()
        // 发起 ajax post 请求
        const data = {
            username: $('#form-reg [name = username]').val(),
            password: $('#form-reg [name = password]').val()
        }
        $.post(
            '/api/reguser',
            data,
            function (res) {
                if (res.status !== 0) return layer.msg(res.message)
                layer.msg('注册成功,请登录')
                $('#link_login').click()
            }
        )
    })

    // 监听登录表单的提交事件
    $('#form-login').submit(function (e) {
        // 取消默认行为
        e.preventDefault()
        // 写接口
        $.ajax({
            url: '/api/login',
            method: 'POST',
            // 快速获取表单内容
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('用户名或密码错误')
                }
                layer.msg('登录成功')
                // 将 token 的值存到 localStorage 中
                localStorage.setItem('token', res.token)
                // 跳转到 首页面
                location.href = '/index.html'
                // console.log(res.token)
            }
        })
    })
})