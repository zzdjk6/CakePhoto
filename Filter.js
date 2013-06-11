//滤镜类
function Filter(cakePhoto){
    this.cakePhoto = cakePhoto;
}

//彩色到灰度
Filter.prototype.grayscale = function(){
    this.cakePhoto.commonWrapper(function(cakePhoto){
        var imageData = cakePhoto.getCurrentImageData();
        var data = imageData.data;
        for (var i = 0; i < data.length; i += 4) {
            var valueRed = data[i];
            var valueGreen = data[i + 1];
            var valueBlue = data[i + 2];
            // RGB到灰度转换公式
            var valueGrey = 0.2126 * valueRed + 0.7152 * valueGreen + 0.0722 * valueBlue;
            data[i] = data[i + 1] = data[i + 2] = valueGrey;
        }
        cakePhoto.context.putImageData(imageData, 0, 0);
    });
}

//彩色到黑白
Filter.prototype.binarize = function(){
    this.cakePhoto.commonWrapper(function(cakePhoto){
        var imageData = cakePhoto.getCurrentImageData();
        var data = imageData.data;
        for (var i = 0; i < data.length; i += 4) {
            var valueRed = data[i];
            var valueGreen = data[i + 1];
            var valueBlue = data[i + 2];
            var valueGrey = (0.2126 * valueRed + 0.7152 * valueGreen + 0.0722 * valueBlue >= 100) ? 255 : 0;
            data[i] = data[i + 1] = data[i + 2] = valueGrey;
        }
        cakePhoto.context.putImageData(imageData, 0, 0);
    });
}

//反色
Filter.prototype.inverseColor = function(){
    this.cakePhoto.commonWrapper(function(cakePhoto){
        var imageData = cakePhoto.getCurrentImageData();
        var data = imageData.data;
        for (var i = 0; i < data.length; i += 4) {
            data[i] = 255 - data[i];
            data[i + 1] = 255 - data[i + 1];
            data[i + 2] = 255 - data[i + 2];
        }
        cakePhoto.context.putImageData(imageData, 0, 0);
    });
}

//平滑滤波
Filter.prototype.smooth = function(){
    this.cakePhoto.commonWrapper(function(cakePhoto){
        var width = cakePhoto.canvas.width;
        var height = cakePhoto.canvas.height;
        var getIndexOfImageArray = function(x, y, channel) {
            return (y * width * 4 + x * 4 + channel);
        };
        
        var tmpCanvas = document.createElement('canvas');
        var tmpContext = tmpCanvas.getContext('2d');
        var tmpImageData = tmpContext.createImageData(width, height);
        var tmpData = tmpImageData.data;

        var imageData = cakePhoto.getCurrentImageData();
        var data = imageData.data;
        for (var y = 0; y < height; y++) {
            for (var x = 0; x < width; x++) {
                //边界点不处理
                if ((x == 0) || (y == 0) || (x == width - 1) || (y == height - 1)) {
                    for (var channel = 0; channel < 4; channel++) {
                        tmpData[getIndexOfImageArray(x, y, channel)] = data[getIndexOfImageArray(x, y, channel)];
                    }
                    continue;
                }

                //非边界点
                for (var channel = 0; channel < 3; channel++) {
                    var indexArray = new Array(9);
                    indexArray[0] = getIndexOfImageArray(x - 1, y - 1, channel);
                    indexArray[1] = getIndexOfImageArray(x, y - 1, channel);
                    indexArray[2] = getIndexOfImageArray(x + 1, y - 1, channel);
                    indexArray[3] = getIndexOfImageArray(x - 1, y, channel);
                    indexArray[4] = getIndexOfImageArray(x, y, channel);
                    indexArray[5] = getIndexOfImageArray(x + 1, y, channel);
                    indexArray[6] = getIndexOfImageArray(x - 1, y + 1, channel);
                    indexArray[7] = getIndexOfImageArray(x, y + 1, channel);
                    indexArray[8] = getIndexOfImageArray(x + 1, y + 1, channel);
                    var value = 0;
                    for (var i = 0; i < 9; i++) {
                        value += data[indexArray[i]];
                    }
                    value = value / 9;
                    tmpData[indexArray[4]] = value;
                }
                tmpData[getIndexOfImageArray(x, y, 3)] = 255;

            }
        }
        cakePhoto.context.putImageData(tmpImageData, 0, 0);
    });
}

//锐化
Filter.prototype.sharpen = function(){
    this.cakePhoto.commonWrapper(function(cakePhoto){
        var width = cakePhoto.canvas.width;
        var height = cakePhoto.canvas.height;
        var getIndexOfImageArray = function(x, y, channel) {
            return (y * width * 4 + x * 4 + channel);
        };
        
        var tmpCanvas = document.createElement('canvas');
        var tmpContext = tmpCanvas.getContext('2d');
        var tmpImageData = tmpContext.createImageData(width, height);
        var tmpData = tmpImageData.data;
        var kernel = [0, -1, 0, -1, 5, -1, 0, -1, 0];

        var imageData = cakePhoto.getCurrentImageData();
        var data = imageData.data;
        for (var y = 0; y < height; y++) {
            for (var x = 0; x < width; x++) {
                //边界点不处理
                if ((x == 0) || (y == 0) || (x == width - 1) || (y == height - 1)) {
                    for (var channel = 0; channel < 4; channel++) {
                        tmpData[getIndexOfImageArray(x, y, channel)] = data[getIndexOfImageArray(x, y, channel)];
                    }
                    continue;
                }

                //非边界点
                for (var channel = 0; channel < 3; channel++) {
                    var indexArray = new Array(9);
                    indexArray[0] = getIndexOfImageArray(x - 1, y - 1, channel);
                    indexArray[1] = getIndexOfImageArray(x, y - 1, channel);
                    indexArray[2] = getIndexOfImageArray(x + 1, y - 1, channel);
                    indexArray[3] = getIndexOfImageArray(x - 1, y, channel);
                    indexArray[4] = getIndexOfImageArray(x, y, channel);
                    indexArray[5] = getIndexOfImageArray(x + 1, y, channel);
                    indexArray[6] = getIndexOfImageArray(x - 1, y + 1, channel);
                    indexArray[7] = getIndexOfImageArray(x, y + 1, channel);
                    indexArray[8] = getIndexOfImageArray(x + 1, y + 1, channel);
                    var value = 0;
                    for (var i = 0; i < 9; i++) {
                        value += kernel[i] * data[indexArray[i]];
                    }
                    tmpData[indexArray[4]] = value;
                }
                tmpData[getIndexOfImageArray(x, y, 3)] = 255;

            }
        }
        cakePhoto.context.putImageData(tmpImageData, 0, 0);
    });
}

//去噪
Filter.prototype.denoise = function(){
    this.cakePhoto.commonWrapper(function(cakePhoto){
        var width = cakePhoto.canvas.width;
        var height = cakePhoto.canvas.height;
        var getIndexOfImageArray = function(x, y, channel) {
            return (y * width * 4 + x * 4 + channel);
        };
        
        var tmpCanvas = document.createElement('canvas');
        var tmpContext = tmpCanvas.getContext('2d');
        var tmpImageData = tmpContext.createImageData(width, height);
        var tmpData = tmpImageData.data;

        var imageData = cakePhoto.getCurrentImageData();
        var data = imageData.data;
        for (var y = 0; y < height; y++) {
            for (var x = 0; x < width; x++) {
                //边界点不处理
                if ((x == 0) || (y == 0) || (x == width - 1) || (y == height - 1)) {
                    for (var channel = 0; channel < 4; channel++) {
                        tmpData[getIndexOfImageArray(x, y, channel)] = data[getIndexOfImageArray(x, y, channel)];
                    }
                    continue;
                }

                //非边界点
                for (var channel = 0; channel < 3; channel++) {
                    var indexArray = new Array(9);
                    indexArray[0] = getIndexOfImageArray(x - 1, y - 1, channel);
                    indexArray[1] = getIndexOfImageArray(x, y - 1, channel);
                    indexArray[2] = getIndexOfImageArray(x + 1, y - 1, channel);
                    indexArray[3] = getIndexOfImageArray(x - 1, y, channel);
                    indexArray[4] = getIndexOfImageArray(x, y, channel);
                    indexArray[5] = getIndexOfImageArray(x + 1, y, channel);
                    indexArray[6] = getIndexOfImageArray(x - 1, y + 1, channel);
                    indexArray[7] = getIndexOfImageArray(x, y + 1, channel);
                    indexArray[8] = getIndexOfImageArray(x + 1, y + 1, channel);
                    var values = new Array(9);
                    for (var i = 0; i < 9; i++) {
                        values[i] = data[indexArray[i]];
                    }
                    values = values.sort(function(a, b) {
                        return a - b;
                    });

                    tmpData[indexArray[4]] = values[4];
                }
                tmpData[getIndexOfImageArray(x, y, 3)] = 255;

            }
        }
        cakePhoto.context.putImageData(tmpImageData, 0, 0);
    });
}

//提取边缘
Filter.prototype.edgeExtract = function(){
    this.cakePhoto.commonWrapper(function(cakePhoto){
        var width = cakePhoto.canvas.width;
        var height = cakePhoto.canvas.height;
        var getIndexOfImageArray = function(x, y, channel) {
            return (y * width * 4 + x * 4 + channel);
        };
        
        var tmpCanvas = document.createElement('canvas');
        var tmpContext = tmpCanvas.getContext('2d');
        var tmpImageData = tmpContext.createImageData(width, height);
        var tmpData = tmpImageData.data;
        var kernelY = [-1, -2, -1, 0, 0, 0, 1, 2, 1];
        var kernelX = [-1, 0, 1, -2, 0, 2, -1, 0, 1];

        var imageData = cakePhoto.getCurrentImageData();
        var data = imageData.data;
        for (var y = 0; y < height; y++) {
            for (var x = 0; x < width; x++) {
                //边界点不处理
                if ((x == 0) || (y == 0) || (x == width - 1) || (y == height - 1)) {
                    for (var channel = 0; channel < 4; channel++) {
                        tmpData[getIndexOfImageArray(x, y, channel)] = data[getIndexOfImageArray(x, y, channel)];
                    }
                    continue;
                }

                //非边界点
                for (var channel = 0; channel < 3; channel++) {
                    var indexArray = new Array(9);
                    indexArray[0] = getIndexOfImageArray(x - 1, y - 1, channel);
                    indexArray[1] = getIndexOfImageArray(x, y - 1, channel);
                    indexArray[2] = getIndexOfImageArray(x + 1, y - 1, channel);
                    indexArray[3] = getIndexOfImageArray(x - 1, y, channel);
                    indexArray[4] = getIndexOfImageArray(x, y, channel);
                    indexArray[5] = getIndexOfImageArray(x + 1, y, channel);
                    indexArray[6] = getIndexOfImageArray(x - 1, y + 1, channel);
                    indexArray[7] = getIndexOfImageArray(x, y + 1, channel);
                    indexArray[8] = getIndexOfImageArray(x + 1, y + 1, channel);
                    var gY = 0;
                    var gX = 0;
                    for (var i = 0; i < 9; i++) {
                        gX += kernelX[i] * data[indexArray[i]];
                        gY += kernelY[i] * data[indexArray[i]];
                    }
                    tmpData[indexArray[4]] = Math.abs(gX) + Math.abs(gY);
                }
                tmpData[getIndexOfImageArray(x, y, 3)] = 255;

            }
        }
        cakePhoto.context.putImageData(tmpImageData, 0, 0);
    });
}

//加运动模糊
Filter.prototype.motionBlur = function(){
    this.cakePhoto.commonWrapper(function(cakePhoto){
        var width = cakePhoto.canvas.width;
        var height = cakePhoto.canvas.height;
        
        var imageData = cakePhoto.getCurrentImageData();
        var data = imageData.data;
        var dataLength = data.length;

        //生成图像三维矩阵
        var pixels = new Array(height);
        for (var i = 0; i < height; i++) {
            pixels[i] = new Array(width);
            for (var j = 0; j < width; j++) {
                pixels[i][j] = new Array(3);
            }
        }

        //生成临时三维矩阵
        var tmpPixels = new Array(height);
        for (var i = 0; i < height; i++) {
            tmpPixels[i] = new Array(width);
            for (var j = 0; j < width; j++) {
                tmpPixels[i][j] = new Array(3);
            }
        }

        //载入图像数据
        for (var y = 0; y < height; y++) {
            for (var x = 0; x < width; x++) {
                for (var k = 0; k < 3; k++) {
                    pixels[y][x][k] = data[y * width * 4 + x * 4 + k];
                    tmpPixels[y][x][k] = data[y * width * 4 + x * 4 + k];
                }
            }
        }

        //横向10格均值平滑，相当于水平移动10个像素
        for (var y = 0; y < height; y++) {
            for (var x = 0; x < width; x++) {
                for (var k = 0; k < 3; k++) {
                    if (x >= 10) {
                        var v = 0;
                        for (var l = 0; l < 10; l++) {
                            v += 1.0 / 10 * tmpPixels[y][x-l][k];
                        }
                        pixels[y][x][k] = v;
                    } else if (x > 0) {
                        var v = 0;
                        for (var l = 0; l < x; l++) {
                            v += 1.0 / x * tmpPixels[y][x-l][k];
                        }
                        pixels[y][x][k] = v;
                    }
                }
            }
        }

        //把结果存回图像数据中
        for (var y = 0; y < height; y++) {
            for (var x = 0; x < width; x++) {
                for (var k = 0; k < 3; k++) {
                    data[y * width * 4 + x * 4 + k] = pixels[y][x][k];
                }
            }
        }

        //显示模糊后的图像
        cakePhoto.context.putImageData(imageData, 0, 0);
    });
}

//去除运动模糊
Filter.prototype.motionDeblur = function(){
    this.cakePhoto.commonWrapper(function(cakePhoto){
        var width = cakePhoto.canvas.width;
        var height = cakePhoto.canvas.height;
        
        var imageData = cakePhoto.getCurrentImageData();
        var data = imageData.data;
        var dataLength = data.length;

        //生成图像三维矩阵
        var pixels = new Array(height);
        for (var i = 0; i < height; i++) {
            pixels[i] = new Array(width);
            for (var j = 0; j < width; j++) {
                pixels[i][j] = new Array(3);
            }
        }

        //生成临时三维矩阵
        var tmpPixels = new Array(height);
        for (var i = 0; i < height; i++) {
            tmpPixels[i] = new Array(width);
            for (var j = 0; j < width; j++) {
                tmpPixels[i][j] = new Array(3);
            }
        }

        //载入图像数据
        for (var y = 0; y < height; y++) {
            for (var x = 0; x < width; x++) {
                for (var k = 0; k < 3; k++) {
                    pixels[y][x][k] = data[y * width * 4 + x * 4 + k];
                    tmpPixels[y][x][k] = data[y * width * 4 + x * 4 + k];
                }
            }
        }

        //g(n) = u(n) - u(n-1) + g(n-D-1),pixels是g
        for (var i = 0; i < 10; i++) {
            for (var y = 0; y < height; y++) {
                for (var x = 0; x < width; x++) {
                    for (var k = 0; k < 3; k++) {
                        if (x > 0) {
                            var v = 0;
                            v = tmpPixels[y][x][k] - tmpPixels[y][x-1][k];
                            v += pixels[y][x][k];
                            pixels[y][x][k] = v;
                        }
                    }
                }
            }
        }

        //把结果存回图像数据中
        for (var y = 0; y < height; y++) {
            for (var x = 0; x < width; x++) {
                for (var k = 0; k < 3; k++) {
                    data[y * width * 4 + x * 4 + k] = pixels[y][x][k];
                }
            }
        }

        //显示去模糊后的图像
        cakePhoto.context.putImageData(imageData, 0, 0);
    });
}