$(function() {
    //文章类别列表战士
    initArtCateList();

    function initArtCateList() {
        $.ajax({
            url: '/my/article/cates',
            success: function(res) {
                // console.log(res);
                var str = template("tpl-art-cate", res);
                $("tbody").html(str);
            }
        })
    }

    //显示添加文章分类列表
    var layer = layui.layer;
    $("#btnAdd").on("click", function() {
        indexAdd = layer.open({
            type: 1,
            title: '添加文章分类',
            area: ['500px', '260px'],
            content: $("#dialog-add").html()
        })
    });

    //提交文章分类添加
    var indexAdd = null;
    $("body").on("submit", "#form-add", function(e) {
        e.preventDefault();
        // alert($(this).serialize());
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                initArtCateList();
                layer.msg("添加成功");
                layer.close(indexAdd);
            }
        })
    });

    //修改文章分类添加
    var indexEdit = null;
    var form = layui.form;
    $("tbody").on("click", ".btn-edit", function() {
        indexEdit = layer.open({
            type: 1,
            title: '修改文章分类',
            area: ['500px', '260px'],
            content: $("#dialog-edit").html()
        });
        var Id = $(this).attr("data-id");
        // alert(Id);
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + Id,
            success: function(res) {
                form.val("form-edit", res.data)
            }
        })
    });

    //修改提交
    $("body").on("submit", "#form-edit", function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                initArtCateList();
                layer.msg("修改成功");
                layer.close(indexEdit);
            }
        })
    });

    //删除
    $("tbody").on("click", ".btn-delete", function() {
        var Id = $(this).attr("data-id");
        layer.confirm('是否确认删除', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + Id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message);
                    }
                    initArtCateList();
                    layer.msg("删除成功")
                    layer.close(index);
                }
            })
        });
    })
})