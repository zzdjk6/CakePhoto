//鼠标在画布上选择区域的监听类
function SelectListener(cakePhoto){
    this.cakePhoto = cakePhoto;
}

SelectListener.prototype.start = function(){
    cakePhoto = this.cakePhoto;
    //鼠标在画布上选择区域
    $(cakePhoto.canvas).mousedown(function(e) {
        cakePhoto.mouseMove.startX = e.pageX - this.offsetLeft;
        cakePhoto.mouseMove.startY = e.pageY - this.offsetTop;
        cakePhoto.mouseMove.endX = null;
        cakePhoto.mouseMove.endY = null;
        cakePhoto.canPaintSelected = true;

        //复原、保存图像本身
        if (cakePhoto.imageBeforeSelected) {
            cakePhoto.drawBeforeSelected();
        }else{
            cakePhoto.imageBeforeSelected = cakePhoto.getCurrentImageData();
        }
    });

    $(cakePhoto.canvas).mousemove(function(e) {
        if (!cakePhoto.canPaintSelected) {
            return;
        }

        cakePhoto.mouseMove.endX = e.pageX - this.offsetLeft;
        cakePhoto.mouseMove.endY = e.pageY - this.offsetTop;

        cakePhoto.context.clearRect(0, 0, this.width, this.height);
        cakePhoto.drawBeforeSelected();

        //临时变量，记录逻辑上选择区域的边界点值
        var startx;
        var starty;
        var endx;
        var endy;

        //适应各种方向的绘制
        if (cakePhoto.mouseMove.startX > cakePhoto.mouseMove.endX) {
            startx = cakePhoto.mouseMove.endX;
            endx = cakePhoto.mouseMove.startX;
        } else {
            startx = cakePhoto.mouseMove.startX;
            endx = cakePhoto.mouseMove.endX;
        }

        if (cakePhoto.mouseMove.startY > cakePhoto.mouseMove.endY) {
            starty = cakePhoto.mouseMove.endY;
            endy = cakePhoto.mouseMove.startY;
        } else {
            starty = cakePhoto.mouseMove.startY;
            endy = cakePhoto.mouseMove.endY;
        }

        //绘制选择框
        cakePhoto.selected.startX = startx;
        cakePhoto.selected.startY = starty;
        cakePhoto.selected.width = endx - startx;
        cakePhoto.selected.height = endy - starty;
        cakePhoto.context.strokeRect(cakePhoto.selected.startX, cakePhoto.selected.startY, cakePhoto.selected.width, cakePhoto.selected.height);
    });

    $(cakePhoto.canvas).mouseup(function(e) {
        cakePhoto.canPaintSelected = false;
    });
}


