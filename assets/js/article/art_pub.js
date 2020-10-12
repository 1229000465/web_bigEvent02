$(function() {
    // 初始化分类
    var form = layui.form;
    var layer = layui.layer;
    initCate();

    function initCate() {
        $.ajax({
            method: "GET",
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

    //点击按钮 选择图片
    $("#btnChooseImage").on("click", function() {
        $("#coverFile").click();
    });

    //设置图片
    $("#coverFile").change(function(e) {
        var file = e.target.files[0];
        // console.log(file);
        if (file == undefined) {
            return layer.msg("请上传图片");
        }
        var newImgURL = URL.createObjectURL(file);
        $image
            .cropper('destroy')
            .attr('src', newImgURL)
            .cropper(options)
    });

    //设置状态
    var state = "已发布";
    $("#btnSave2").on("click", function() {
        state = "草稿";
    });

    //添加文章
    $("#form-pub").on("submit", function(e) {
        e.preventDefault();
        //创建FormData对象，收集数据
        var fd = new FormData(this);
        //放入状态
        fd.append("state", state);
        //放入图片
        $image.cropper('getCroppedCanvas', {
                width: 400,
                height: 280
            })
            .toBlob(function(blob) {
                fd.append('cover_img', blob);
                // console.log(...fd);
                publishArticle(fd);
            })
    });

    //封装 添加文章方法
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg("文章发布成功");
                // location.href = "/article/art_list.html"
                setTimeout(function() {
                    window.parent.document.getElementById("art_list").click();
                }, 1500)
            }
        })
    }
})