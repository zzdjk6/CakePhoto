//拖放图像监听类
function DragDropListener(cakePhoto){
    this.cakePhoto = cakePhoto;
}

DragDropListener.prototype.start = function(){
    cakePhoto = this.cakePhoto;
    //拖放图像文件到画布上可以在画布上绘制所拖放的图像
    cakePhoto.canvas.ondragenter = function(e) {
        e.preventDefault()
    };
    cakePhoto.canvas.ondragover = function(e) {
        e.preventDefault()
    };
    cakePhoto.canvas.ondrop = function(e) {
        var imageFile = e.dataTransfer.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(imageFile);
        reader.onload = function(e) {
            cakePhoto.originalImage.src = this.result;
        }
        e.preventDefault();
    }
}
