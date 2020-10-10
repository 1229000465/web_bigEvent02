$(function() {
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
        // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    //选择文件
    $("#btnChooseImage").on("click", function() {
        $("#file").click();
    })

    //修改裁剪图片
    var layer = layui.layer;
    $("#file").on("change", function(e) {
        var file = e.target.files[0];
        // console.log(e);
        if (file == null) {
            return layer.msg("请选择图片");
        }
        var newImgURL = URL.createObjectURL(file);
        // console.log(newImgURL);
        $image
            .cropper('destroy')
            .attr('src', newImgURL)
            .cropper(options)
    })

    //上传头像
    $("#btnUpload").on("click", function() {
        var dataURL = $image
            .cropper('getCroppedCanvas', {
                width: 100,
                height: 100
            })
            .toDataURL('image/png')
            // console.log(dataURL);
            // console.log(typeof dataURL);
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg("更换头像成功");
                window.parent.getUserInof();
            }
        })
    })
})