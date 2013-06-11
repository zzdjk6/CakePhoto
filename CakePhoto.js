//定义CakePhoto的构造函数
function CakePhoto(originalImageId,canvasId){
    //原始图像
    this.originalImage = document.getElementById(originalImageId);
    //对画布的引用
    this.canvas = document.getElementById(canvasId);
    //对绘图上下文的引用
    this.context = this.canvas.getContext('2d');
    //和历史记录有关的栈数组
    this.undoStack = [];
    this.redoStack = [];
    //记录鼠标移动起止的四个点
    this.mouseMove = {
        startX : null,
        startY : null,
        endX : null,
        endY : null,
    };
    //记录选择区域
    this.selected = {
        startX : null,
        startY : null,
        width : null,
        height : null,
    };
    //记录鼠标选择前的图像数据
    this.imageBeforeSelected = null;
    //标识是否绘制选择框
    this.canPaintSelected = false;
};

//图像加载时自动绘制到画布上
CakePhoto.prototype.addImageLoadListener = function(ImageLoadListener){
    this.imageLoadListener = new ImageLoadListener(this);
    this.imageLoadListener.start();
}

//拖放外部到画布上时，自动载入所拖放的图像
CakePhoto.prototype.addDragDropListener = function(DragDropListener){
    this.dragDropListener = new DragDropListener(this);
    this.dragDropListener.start();
}

//鼠标可以在画布上选择区域
CakePhoto.prototype.addSelectListener = function(SelectListener){
    this.selectListener = new SelectListener(this);
    this.selectListener.start();
}

//绑定编辑器
CakePhoto.prototype.bindBasicEditor = function(BasicEditor){
    this.basicEditor = new BasicEditor(this);
}

//绑定滤镜
CakePhoto.prototype.bindFilter = function(Filter){
    this.filter = new Filter(this);
}

//给定x,y,channel值，获取图像数组中的位置。注意：0-index based
CakePhoto.prototype.getIndexOfImageArray = function(x, y, channel) {
    var index = y * this.canvas.width * 4 + x * 4 + channel;
    return index;
}

//更新画布当前大小记录
CakePhoto.prototype.updateCanvasScale = function(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
}
//将鼠标选择之前的图像绘制到画布上
CakePhoto.prototype.drawBeforeSelected = function() {
    this.context.putImageData(this.imageBeforeSelected, 0, 0);
}
//获取当前画布上的图像数据
CakePhoto.prototype.getCurrentImageData = function(){
    return this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
}
//记录undo历史
CakePhoto.prototype.pushUndoStack = function(){
    this.undoStack.push(this.getCurrentImageData());
}
//清空redo历史
CakePhoto.prototype.clearRedoStack = function(){
    this.redoStack = [];
}
//清空与选择鼠标有关的变量
CakePhoto.prototype.clearSelect = function(){
    this.imageBeforeSelected = null;
    this.selected = {
        startX:null,
        startY:null,
        width:null,
        height:null,
    };
}

//常见重复任务的委托模式
CakePhoto.prototype.commonWrapper = function(fn){
    this.pushUndoStack();
    this.clearRedoStack();

    fn(this);

    this.clearSelect();
}