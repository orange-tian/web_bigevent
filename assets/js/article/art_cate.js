$(function () {
    const layer = layui.layer
    const form = layui.form

    initArtCateList()
    // 获取文章列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res)
                if (res.status !== 0) {
                    return layui.layer.msg('文章列表获取失败')
                }
                const htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }


    // 添加类别的点击事件
    let indexAdd = null
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        });
    })
    // 新增分类的提交事件
    // 因为表单是通过script 动态添加的 不能直接 $('#form-add) 选不中
    // 所以通过代理的方式来给表单绑定事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        // console.log('ok')
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res)
                if (res.status !== 0) {
                    return layer.msg('新增分类失败！')
                }
                // 重新渲染表单
                initArtCateList()
                layer.msg('新增分类成功！')
                // 关闭弹出层
                layer.close(indexAdd)
            }
        })
    })

    // 编辑事件
    let indexEdit = null
    $('tbody').on('click', '.btn-edit', function () {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '编辑文章分类',
            content: $('#dialog-edit').html()
        })
        // 获取点击的行的 id
        let id = $(this).attr('data-id')
        console.log(id)
        // 发请求获取对应的数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                // console.log(res)
                form.val('form-edit', res.data)
            }
        })
    })

    // 代理的形式来给 表单绑定submit 事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                console.log(res)
                if (res.status !== 0) {
                    return layer.msg('更新分类数据失败')
                }
                layer.msg('更新分类数据成功')
                layer.close(indexEdit)
                initArtCateList()
            }
        })
    })

    // 通过代理的形式给删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function () {
        const id = $(this).attr('data-id')
        // 弹出层 询问用户是否要删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            // 发请求删除
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类数据失败')
                    }
                    layer.msg('删除分类数据成功')
                    initArtCateList()
                }
            })

            layer.close(index);
        });

    })
})