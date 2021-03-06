$(function() {
    //定义时间过滤器
    template.defaults.imports.dateFormat = function(dtStr) {
        var dt = new Date(dtStr);

        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());

        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    }

    //补零
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }


    //定义提交参数
    var q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: "",
        state: ""
    }

    // 初始化文章列表
    initTable();

    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                var str = template("tpl-table", res);
                $("tbody").html(str);
                //分页
                renderPage(res.total)
            }
        })
    }

    //初始化分类
    var form = layui.form;
    initCate();

    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                var htmlStr = template("tpl-cate", res);
                $("[name=cate_id]").html(htmlStr);
                form.render();
            }
        })
    }

    //筛选功能
    $("#form-search").on("submit", function(e) {
        e.preventDefault();
        var state = $("[name=state]").val();
        var cate_id = $("[name=cate_id]").val();
        q.state = state;
        q.cate_id = cate_id;
        initTable();
    });

    //分页
    var laypage = layui.laypage;

    function renderPage(total) {
        laypage.render({
            elem: 'pageBox',
            count: total,
            limit: q.pagesize,
            curr: q.pagenum,

            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],

            jump: function(obj, first) {
                console.log(first, obj.curr, obj.limit);
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;
                if (!first) {
                    initTable();
                }
            }
        })
    }

    //删除
    var layer = layui.layer;
    $("tbody").on("click", ".btn-delete", function() {
        var Id = $(this).attr("data-id");
        // console.log(Id);
        layer.confirm('确认删除？', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + Id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message);
                    }
                    if ($(".btn-delete").length == 1 && q.pagenum > 1) q.pagenum--
                        initTable();
                    layer.msg("删除成功")
                }
            })
            layer.close(index);
        });
    })
})