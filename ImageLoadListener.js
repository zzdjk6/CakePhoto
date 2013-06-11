//图像加载类
function ImageLoadListener(cakePhoto){
    this.cakePhoto = cakePhoto;
}

ImageLoadListener.prototype.start = function(){
    cakePhoto = this.cakePhoto;
    //图像加载后，自动绘制到画布上
    $(cakePhoto.originalImage).load(function() {
        
        var width = this.width;
        var height = this.height;

        //图像最大宽度只能为720，若超过720，则按比例缩放至720
        if (this.width > 720) {
            var ratio = parseFloat(this.height) / parseFloat(this.width);
            this.width = 720;
            this.height = parseInt(this.width * ratio);
        }

        //初始化canvas的长和宽
        cakePhoto.updateCanvasScale(this.width, this.height);
        //在画布上绘制图像
        cakePhoto.context.drawImage(this, 0, 0, width, height, 0, 0, this.width, this.height);
    });
}