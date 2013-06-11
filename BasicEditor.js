//基础编辑类
function BasicEditor(cakePhoto){
    this.cakePhoto = cakePhoto;
}

//撤销
BasicEditor.prototype.undo = function(){
    cakePhoto = this.cakePhoto;
    
    if (cakePhoto.undoStack.length == 0) {
        return;
    }

    var imageData = cakePhoto.undoStack.pop();
    cakePhoto.redoStack.push(cakePhoto.getCurrentImageData());
    cakePhoto.updateCanvasScale(imageData.width, imageData.height);
    cakePhoto.context.putImageData(imageData, 0, 0);
                
    cakePhoto.clearSelect();
}

//重做
BasicEditor.prototype.redo = function(){
    cakePhoto = this.cakePhoto;
    
    if (cakePhoto.redoStack.length == 0) {
        return;
    }

    var imageData = cakePhoto.redoStack.pop();
    cakePhoto.pushUndoStack();
    cakePhoto.updateCanvasScale(imageData.width, imageData.height);
    cakePhoto.context.putImageData(imageData, 0, 0);
                
    cakePhoto.clearSelect();
}

//旋转90度
BasicEditor.prototype.rotate = function(){    
    this.cakePhoto.commonWrapper(function(cakePhoto){
        var imageData = cakePhoto.getCurrentImageData();
        var width = imageData.width;
        var height = imageData.height;
        //创建临时画布
        var tmpCanvas = document.createElement('canvas');
        var tmpContext = tmpCanvas.getContext('2d');
        tmpCanvas.width = width;
        tmpCanvas.height = height;
        tmpContext.putImageData(imageData, 0, 0);

        //由于旋转90度后，图像原先的长等于现在的宽，原先的宽等于现在的长
        //而旋转后的图像宽度不能超过720，所以原图长度不能超过720，若超过，则按比例缩放之
        if (height > 720) {
            var ratio = parseFloat(width) / parseFloat(height);
            height = 720;
            width = parseInt(height * ratio);
        }
                
        cakePhoto.updateCanvasScale(width, height);

        //保存绘图状态--缩放比例
        cakePhoto.context.save()
        cakePhoto.context.scale(parseFloat(width) / cakePhoto.canvas.width, parseFloat(height) / cakePhoto.canvas.height);
        cakePhoto.context.drawImage(tmpCanvas, 0, 0, tmpCanvas.width, tmpCanvas.height, 0, 0, width, height);
        //恢复绘图状态
        cakePhoto.context.restore();

        tmpCanvas.width = width;
        tmpCanvas.height = height;
        tmpContext.drawImage(cakePhoto.canvas, 0, 0);

        //旋转90度后，图像原先的长等于现在的宽，原先的宽等于现在的长
        var tmp = height;
        height = width;
        width = tmp;
                
        cakePhoto.updateCanvasScale(width, height);

        //保存绘图状态--中心点
        cakePhoto.context.save();
        cakePhoto.context.translate(tmpCanvas.height / 2, tmpCanvas.width / 2);
        cakePhoto.context.rotate(Math.PI / 2);
        cakePhoto.context.drawImage(tmpCanvas, -tmpCanvas.width / 2, -tmpCanvas.height / 2);
        //恢复绘图状态
        cakePhoto.context.restore();
    });
}

//水平翻转
BasicEditor.prototype.flipHorizontal = function(){
    this.cakePhoto.commonWrapper(function(cakePhoto){
        var imageData = cakePhoto.getCurrentImageData();
        var width = imageData.width;
        var height = imageData.height;
        var data = imageData.data;
        for (var y = 0; y < height; y++) {
            for (var x = 0; x < width / 2; x++) {
                for (var channel = 0; channel < 3; channel++) {
                    var indexA = cakePhoto.getIndexOfImageArray(x, y, channel);
                    var indexB = cakePhoto.getIndexOfImageArray(width - x, y, channel);
                    var tmp = data[indexA];
                    data[indexA] = data[indexB];
                    data[indexB] = tmp;
                }
            }
        }
        cakePhoto.context.putImageData(imageData, 0, 0);
    });
}

//垂直翻转
BasicEditor.prototype.flipVertical = function(){
    this.cakePhoto.commonWrapper(function(cakePhoto){
        var imageData = cakePhoto.getCurrentImageData();
        var width = imageData.width;
        var height = imageData.height;
        var data = imageData.data;
        for (var x = 0; x < width; x++) {
            for (var y = 0; y < height / 2; y++) {
                for (var channel = 0; channel < 3; channel++) {
                    var indexA = cakePhoto.getIndexOfImageArray(x, y, channel);
                    var indexB = cakePhoto.getIndexOfImageArray(x, height - y, channel);
                    var tmp = data[indexA];
                    data[indexA] = data[indexB];
                    data[indexB] = tmp;
                }
            }
        }
        cakePhoto.context.putImageData(imageData, 0, 0);
    });
}

//缩放
BasicEditor.prototype.scale = function(targetWidth,targetHeight){
    this.cakePhoto.commonWrapper(function(cakePhoto){
        var width = cakePhoto.canvas.width;
        var height = cakePhoto.canvas.height;
        
        //在临时画布上保存原始信息
        var tmpCanvas = document.createElement('canvas');
        var tmpContext = tmpCanvas.getContext('2d');
        tmpCanvas.width = width;
        tmpCanvas.height = height;
        tmpContext.drawImage(cakePhoto.canvas, 0, 0);

        //如果只输入了宽度或高度，则另一个按比例自动确定
        if (!targetHeight) {
            targetHeight = parseInt(targetWidth * (parseFloat(height) / width));
        }
        if (!targetWidth) {
            targetWidth = parseInt(targetHeight * (parseFloat(width) / height));
        }

        width = targetWidth;
        height = targetHeight;
        //调整画布
        cakePhoto.updateCanvasScale(width, height);

        //保存绘图状态
        cakePhoto.context.save();
        cakePhoto.context.scale(parseFloat(width) / tmpCanvas.width, parseFloat(height) / tmpCanvas.height);
        cakePhoto.context.drawImage(tmpCanvas, 0, 0);
        //恢复绘图状态
        cakePhoto.context.restore();
    });
}

//剪裁
BasicEditor.prototype.clip = function(){
    //不要保留选择时的边框
    this.cakePhoto.drawBeforeSelected();
    
    this.cakePhoto.commonWrapper(function(cakePhoto){
        var imageData = cakePhoto.context.getImageData(cakePhoto.selected.startX, cakePhoto.selected.startY, cakePhoto.selected.width, cakePhoto.selected.height);
        cakePhoto.updateCanvasScale(cakePhoto.selected.width, cakePhoto.selected.height);
        cakePhoto.context.putImageData(imageData, 0, 0);
    });
}

//变亮和变暗
BasicEditor.prototype.changeBrightness = function(increcement){
    this.cakePhoto.commonWrapper(function(cakePhoto){
        var imageData = cakePhoto.getCurrentImageData();
        var width = imageData.width;
        var height = imageData.height;
        var data = imageData.data;
        for (var y = 0; y < height; y++) {
            for (var x = 0; x < width; x++) {
                for (var channel = 0; channel < 3; channel++) {
                    var index = cakePhoto.getIndexOfImageArray(x, y, channel);
                    data[index] += increcement;
                }
            }
        }
        cakePhoto.context.putImageData(imageData, 0, 0);
    });
}

//增强对比度
BasicEditor.prototype.histogramEqualize = function(){
    this.cakePhoto.commonWrapper(function(cakePhoto){
        var imageData = cakePhoto.getCurrentImageData();
        var data = imageData.data;
        var length = data.length;
        var width = imageData.width;
        var height = imageData.height;
        var area = width * height;

        var histR = new Array(256);
        var histG = new Array(256);
        var histB = new Array(256);

        var statR = new Array(256);
        var statG = new Array(256);
        var statB = new Array(256);

        var relR = new Array(256);
        var relG = new Array(256);
        var relB = new Array(256);

        //初始化数组
        for (var i = 0; i < 256; i++) {
            histR[i] = 0;
            histG[i] = 0;
            histB[i] = 0;
        }

        for (var i = 0; i < length; i += 4) {
            //统计直方图
            //red
            histR[data[i]]++;
            //green
            histG[data[i + 1]]++;
            //blue
            histB[data[i + 2]]++;
        }

        //求百分比
        for (var i = 0; i < 256; i++) {
            histR[i] *= (1 / area);
            histG[i] *= (1 / area);
            histB[i] *= (1 / area);
        }

        //求累计百分比
        statR[0] = histR[0];
        statG[0] = histG[0];
        statB[0] = histB[0];
        for (var i = 1; i < 256; i++) {
            statR[i] = statR[i - 1] + histR[i];
            statG[i] = statG[i - 1] + histG[i];
            statB[i] = statB[i - 1] + histB[i];
        }

        //求对应关系
        for (var i = 0; i < 256; i++) {
            relR[i] = statR[i] * 256;
            relG[i] = statG[i] * 256;
            relB[i] = statB[i] * 256;
        }

        //遍历图像应用对应关系
        for (var i = 0; i < length; i += 4) {
            //red
            data[i] = relR[data[i]];
            data[i + 1] = relG[data[i + 1]];
            data[i + 2] = relB[data[i + 2]];
        }

        cakePhoto.context.putImageData(imageData, 0, 0);
    });
}

//去除红眼
BasicEditor.prototype.removeRedEye = function(){
    this.cakePhoto.commonWrapper(function(cakePhoto){
        var imageData = cakePhoto.getCurrentImageData();
        var data = imageData.data;
        var yInit = cakePhoto.selected.startY;
        var yEnd = cakePhoto.selected.startY + cakePhoto.selected.height;
        var xInit = cakePhoto.selected.startX;
        var xEnd = cakePhoto.selected.startX + cakePhoto.selected.width;
        for (var y = yInit; y < yEnd; y++) {
            for (var x = xInit; x < xEnd; x++) {
                var indexRed = cakePhoto.getIndexOfImageArray(x, y, 0);
                var indexGreen = cakePhoto.getIndexOfImageArray(x, y, 1);
                var indexBlue = cakePhoto.getIndexOfImageArray(x, y, 2);

                var valueRed = data[indexRed];
                var valueGreen = data[indexGreen];
                var valueBlue = data[indexBlue];

                //简单的红眼判断，需要精确选择
                if (valueRed > (valueGreen + valueBlue)/2) {
                    valueRed = (valueGreen + valueBlue) / 2;
                    valueGreen = (valueGreen + valueRed) / 2;
                    valueBlue = (valueBlue + valueRed) / 2;

                    data[indexRed] = valueRed;
                    data[indexGreen] = valueGreen;
                    data[indexBlue] = valueBlue;
                }
            }
        }

        cakePhoto.context.putImageData(imageData, 0, 0);
    });
   
}