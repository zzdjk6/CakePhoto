//拼图类
function Jigsaw(canvasId){
    //对画布的引用
    this.canvas = document.getElementById(canvasId);  
    //对绘图上下文的引用
    this.context = this.canvas.getContext('2d');
    //模式列表
    this.modeList = {
        '1':this.changeToMode1,//上一下一
        '2':this.changeToMode2,//左一右一
        '3':this.changeToMode3,//上一下二
        '4':this.changeToMode4,//上二下一
        '5':this.changeToMode5,//左一右二
        '6':this.changeToMode6,//左二右一
    };
    
    //初始化大小
    this.canvas.width = 720;
    this.canvas.height = 600;
    
    //初始化拖放
    this.canvas.ondragenter = function(e) {
        e.preventDefault();
    };
    this.canvas.ondragover = function(e) {
        e.preventDefault();
    };
}

//切换拼图模式
Jigsaw.prototype.changeMode = function(mode){
    var fn = this.modeList[mode];
    fn(this.canvas,this.context);
}

Jigsaw.prototype.changeToMode1 = function(canvas,context){
    //初始化背景
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);

    //初始化分割线
    context.beginPath();
    context.moveTo(0, 300);
    context.lineTo(720, 300);
    context.closePath();
    context.strokeStyle = "black";
    context.stroke();

    //绘制像素提示信息
    context.font = "italic bold 64px serif";
    context.fillStyle = "black";
    context.fillText('720 x 300', 230, 150);
    context.fillText('720 x 300', 230, 450);

    
    canvas.ondrop = function(e) {
        var canvasOffset = $(canvas).offset();
        var canvasX = Math.floor(e.pageX - canvasOffset.left);
        var canvasY = Math.floor(e.pageY - canvasOffset.top);

        var imageFile = e.dataTransfer.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(imageFile);
        reader.onload = function(e) {
            var image = new Image();
            image.src = this.result;
            if (canvasY < 300) {
                context.drawImage(image, 0, 0, 720, 300);
            } else {
                context.drawImage(image, 0, 300, 720, 300);
            }

        }
        e.preventDefault();
    }
}
    
Jigsaw.prototype.changeToMode2 = function(canvas,context){
    //初始化背景
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);

    //初始化分割线
    context.beginPath();
    context.moveTo(360, 0);
    context.lineTo(360, 600);
    context.closePath();
    context.strokeStyle = "black";
    context.stroke();

    //绘制像素提示信息
    context.font = "italic bold 64px serif";
    context.fillStyle = "black";
    context.fillText('360 x 600', 50, 300);
    context.fillText('360 x 600', 410, 300);

    
    canvas.ondrop = function(e) {
        var canvasOffset = $(canvas).offset();
        var canvasX = Math.floor(e.pageX - canvasOffset.left);
        var canvasY = Math.floor(e.pageY - canvasOffset.top);

        var imageFile = e.dataTransfer.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(imageFile);
        reader.onload = function(e) {
            var image = new Image();
            image.src = this.result;
            if (canvasX < 360) {
                context.drawImage(image, 0, 0, 360, 600);
            } else {
                context.drawImage(image, 360, 0, 360, 600);
            }

        }
        e.preventDefault();
    }
}
    
Jigsaw.prototype.changeToMode3 = function(canvas,context){
    
    //初始化背景
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);

    //初始化分割线
    context.beginPath();
    context.moveTo(0, 300);
    context.lineTo(720, 300);
    context.moveTo(360, 300);
    context.lineTo(360, 600);
    context.closePath();
    context.strokeStyle = "black";
    context.stroke();

    //绘制像素提示信息
    context.font = "italic bold 64px serif";
    context.fillStyle = "black";
    context.fillText('720 x 300', 230, 150);
    context.fillText('360 x 300', 50, 480);
    context.fillText('360 x 300', 410, 480);

    
    canvas.ondrop = function(e) {
        var canvasOffset = $(canvas).offset();
        var canvasX = Math.floor(e.pageX - canvasOffset.left);
        var canvasY = Math.floor(e.pageY - canvasOffset.top);

        var imageFile = e.dataTransfer.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(imageFile);
        reader.onload = function(e) {
            var image = new Image();
            image.src = this.result;
            if (canvasY < 300) {
                context.drawImage(image, 0, 0, 720, 300);
            } else if (canvasX < 360) {
                context.drawImage(image, 0, 300, 360, 300);
            } else {
                context.drawImage(image, 360, 300, 360, 300);
            }

        }
        e.preventDefault();
    }
}
    
Jigsaw.prototype.changeToMode4 = function(canvas,context){
    //初始化背景
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);

    //初始化分割线
    context.beginPath();
    context.moveTo(0, 300);
    context.lineTo(720, 300);
    context.moveTo(360, 0);
    context.lineTo(360, 300);
    context.closePath();
    context.strokeStyle = "black";
    context.stroke();

    //绘制像素提示信息
    context.font = "italic bold 64px serif";
    context.fillStyle = "black";
    context.fillText('360 x 300', 50, 150);
    context.fillText('360 x 300', 410, 150);
    context.fillText('720 x 300', 230, 480);
    
    canvas.ondrop = function(e) {
        var canvasOffset = $(canvas).offset();
        var canvasX = Math.floor(e.pageX - canvasOffset.left);
        var canvasY = Math.floor(e.pageY - canvasOffset.top);

        var imageFile = e.dataTransfer.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(imageFile);
        reader.onload = function(e) {
            var image = new Image();
            image.src = this.result;
            if (canvasY > 300) {
                context.drawImage(image, 0,300, 720, 300);
            } else if (canvasX < 360) {
                context.drawImage(image, 0, 0, 360, 300);
            } else {
                context.drawImage(image, 360, 0, 360, 300);
            }

        }
        e.preventDefault();
    }
}
    
Jigsaw.prototype.changeToMode5 = function(canvas,context){
    //初始化背景
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);

    //初始化分割线
    context.beginPath();
    context.moveTo(360, 0);
    context.lineTo(360, 600);
    context.moveTo(360,300);
    context.lineTo(720, 300);
    context.closePath();
    context.strokeStyle = "black";
    context.stroke();

    //绘制像素提示信息
    context.font = "italic bold 64px serif";
    context.fillStyle = "black";
    context.fillText('360 x 600', 50, 300);
    context.fillText('360 x 300', 410, 150);
    context.fillText('360 x 300', 410, 450);

    
    canvas.ondrop = function(e) {
        var canvasOffset = $(canvas).offset();
        var canvasX = Math.floor(e.pageX - canvasOffset.left);
        var canvasY = Math.floor(e.pageY - canvasOffset.top);

        var imageFile = e.dataTransfer.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(imageFile);
        reader.onload = function(e) {
            var image = new Image();
            image.src = this.result;
            if (canvasX < 360) {
                context.drawImage(image, 0, 0, 360, 600);
            } else if(canvasY < 300){
                context.drawImage(image, 360, 0, 360, 300);
            }else{
                context.drawImage(image, 360, 300, 360, 300);
            }

        }
        e.preventDefault();
    }
}
    
Jigsaw.prototype.changeToMode6 = function(canvas,context){
    //初始化背景
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);

    //初始化分割线
    context.beginPath();
    context.moveTo(360, 0);
    context.lineTo(360, 600);
    context.moveTo(0,300);
    context.lineTo(360, 300);
    context.closePath();
    context.strokeStyle = "black";
    context.stroke();

    //绘制像素提示信息
    context.font = "italic bold 64px serif";
    context.fillStyle = "black";
    context.fillText('360 x 600', 410, 300);
    context.fillText('360 x 300', 50, 150);
    context.fillText('360 x 300', 50, 450);

    
    canvas.ondrop = function(e) {
        var canvasOffset = $(canvas).offset();
        var canvasX = Math.floor(e.pageX - canvasOffset.left);
        var canvasY = Math.floor(e.pageY - canvasOffset.top);

        var imageFile = e.dataTransfer.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(imageFile);
        reader.onload = function(e) {
            var image = new Image();
            image.src = this.result;
            if (canvasX > 360) {
                context.drawImage(image, 360, 0, 360, 600);
            } else if(canvasY < 300){
                context.drawImage(image, 0, 0, 360, 300);
            }else{
                context.drawImage(image, 0, 300, 360, 300);
            }

        }
        e.preventDefault();
    }
}
