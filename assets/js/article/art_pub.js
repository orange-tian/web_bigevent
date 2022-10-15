$(function () {
    const layer = layui.layer
    const form = layui.form

    initCate()

    // 获取文章分类
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res)
                if (res.status !== 0) {
                    return layer.msg('文章类别获取失败')
                }
                // 获取成功后 调用模板引擎
                const htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // 一定要调用form.render 重新渲染表单
                form.render()
            }
        })
    }

    // 初始化富文本编辑器
    initEditor()

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 为选择封面绑定事件
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click()
    })
    // 监听文件选择框的 change 事件
    $('#coverFile').on('change', function (e) {
        const files = e.target.files
        if (files.length === 0) {
            return
        }
        // 拿到用户选择的文件
        // var file = e.target.files[0]
        // 根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(files[0])
        // 先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域：
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    // 定义文章状态
    // 默认是 已发布
    var art_state = '已发布'
    // 当点击 草稿 按钮的时候 就改成草稿
    $('#btnSave2').on('click', function () {
        art_state = '草稿'
    })

    // 为表单绑定 submit 事件
    $('#form-pub').on('submit', function (e) {
        // 1 阻止表单的默认提交行为
        e.preventDefault()
        // 2 创建一个 formData 对象
        let fd = new FormData($(this)[0])
        // 3 把 state 追加到 formdata 中
        fd.append('state', art_state)
        // 4 将裁剪后的图片输出为一个文件
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5 将 裁剪后的文件 追加到 formdata中
                fd.append('cover_img', blob)
                // 6 发起ajax 请求
                publishArticle(fd)
            })

    })

    // 定义 发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意 如果向服务器提交的数据是 FormData 格式的数据
            // 要配置以下两个配置项
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败')
                }
                // 发布成功 然后跳转到 文章列表页
                location.href = '/article/art_list.html'
            }
        })
    }
})