$(function () {
    const layer = layui.layer
    const form = layui.form
    const laypage = layui.laypage;
    // 定义一个参数查询对象
    // 将来请求数据的时候，需要将参数对象提交到服务器
    let q = {
        pagenum: 1, // 页码值
        pagesize: 2, // 每页显示多少条数据
        cate_id: '', // 文章分类的Id
        state: '', // 文章的状态
    }

    initTable()
    initCate()


    function initTable() {
        // 发起请求获取文章列表
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                // console.log(res)
                if (res.status !== 0) {
                    return layer.msg('文章列表获取失败')
                }
                const htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                renderPage(res.total)
            }
        })
    }

    // 定义时间美化过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)
        const y = dt.getFullYear()
        const m = padZero(dt.getMonth() + 1)
        const d = padZero(dt.getDate())
        const hh = padZero(dt.getHours())
        const mm = padZero(dt.getMinutes())
        const ss = padZero(dt.getSeconds())
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    // 获取分类列表
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类列表失败')
                }
                const htmlStr = template('tpl-cate', res)
                $('#cate_id').html(htmlStr)
                // 因为 layui的渲染机制  必须要调用 form.render 才可以渲染出下拉列表的内容
                // 通知 layui 重新渲染表单的ui结构
                form.render()
            }
        })
    }

    // 为筛选表单绑定submit 事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        // 获取 表单中选项的值
        const cate_id = $('[name=cate_id]').val()
        const state = $('[name=state]').val()
        // 赋值给 q 数据对象
        q.cate_id = cate_id
        q.state = state
        // 重新渲染表格中的数据
        initTable()
    })

    // 定义渲染分页的方法
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox', // 存放分页的 容器 id
            count: total, // 数据总数
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum, // 起始页
            // 自定义排版
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 分页发生切换的时候，触发 jump 回调
            // 触发 jump 有两种方式
            // 1 点击页码后 会触发 jump 
            // 2 调用 laypage.render 也会触发 jump
            jump: function (obj, first) {
                // 把获取到的 分页值 赋值给 查询对象q
                q.pagenum = obj.curr
                // 获取每页的条目数 赋值给查询对象 q
                q.pagesize = obj.limit
                // 当 通过 laypage.render 触发 jump时，first的值为true
                // 当 通过点击页码触发 jump 时 first 的值为 undefined
                if (!first) {
                    initTable()
                }
            }
        })
    }

    // 删除文章
    $('tbody').on('click', '.btn-delete', function () {
        // 判断页面中有几个删除按钮 来判定有几条数据
        const len = $('.btn-delete').length
        // console.log(len)

        // 获取id值
        const id = $(this).attr('data-id')
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败')
                    }
                    layer.msg('删除文章成功')
                    // 当数据删除之后，需要判断页面中是否还有数据
                    // 如果页面中没有数据了，那么页码值就要减1
                    // 再 调用 initTable 方法渲染页面
                    // 当 len 的值 为1 证明删除之后就没有数据了 页码值要减去1 重新赋值
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })


            layer.close(index);
        });

    })

    // 修改文章
    $('tbody').on('click', '.btn-change', function () {

    })
})