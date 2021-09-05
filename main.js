const segx = 11, segy = 15;
const sx = sy = 40;
const interval = 500;
const MODEL_CNT = 7;
const SEGMENT_CNT = 4;
const itemColors = Array("Tomato", "Orange", "DodgerBlue", "MediumSeaGreen", "Gray", "SlateBlue", "Violet");
const solidColors = Array("CadetBlue", "Chocolate");
var blocks = Array(MODEL_CNT);

blocks[0] = Array(
    [{ x: -1, y: 1}, { x: 0, y: 1}, { x: 1, y: 1}, { x: 2, y: 1}],
    [{ x: 0, y: 0}, { x: 0, y: 1}, { x: 0, y: 2}, { x: 0, y: 3}],
    [{ x: -1, y: 1}, { x: 0, y: 1}, { x: 1, y: 1}, { x: 2, y: 1}],
    [{ x: 0, y: 0}, { x: 0, y: 1}, { x: 0, y: 2}, { x: 0, y: 3}],
);
blocks[1] = Array(
    [{ x: -1, y: 0}, {x: 0, y: 0}, {x: 0, y: 1}, {x: 1, y: 1}],
    [{ x: -1, y: 2}, {x: -1, y: 1}, {x: 0, y: 1}, {x: 0, y: 0}],
    [{ x: -1, y: 0}, {x: 0, y: 0}, {x: 0, y: 1}, {x: 1, y: 1}],
    [{ x: -1, y: 2}, {x: -1, y: 1}, {x: 0, y: 1}, {x: 0, y: 0}]
);
blocks[2] = Array(
    [{ x: -1, y: 1}, {x: 0, y: 1}, {x: 0, y: 0}, {x: 1, y: 0}],
    [{ x: -1, y: 0}, {x: -1, y: 1}, {x: 0, y: 1}, {x: 0, y: 2}],
    [{ x: -1, y: 1}, {x: 0, y: 1}, {x: 0, y: 0}, {x: 1, y: 0}],
    [{ x: -1, y: 0}, {x: -1, y: 1}, {x: 0, y: 1}, {x: 0, y: 2}]
);
blocks[3] = Array(
    [{ x: 0, y: 0}, {x: -1, y: 1}, {x: 0, y: 1}, {x: 1, y: 1}],
    [{x: -1, y: 1}, {x: 0, y: 2}, {x: 0, y: 1}, {x: 0, y: 0}],
    [{ x: 0, y: 2}, {x: 1, y: 1}, {x: 0, y: 1}, {x: -1, y: 1}],
    [{ x: 1, y: 1}, {x: 0, y: 0}, {x: 0, y: 1}, {x: 0, y: 2}],
);
blocks[4] = Array(
    [{ x: -1, y: 0}, {x: -1, y: 1}, {x: 0, y: 1}, {x: 1, y: 1}],
    [{ x: -1, y: 2}, {x: 0, y: 2}, {x: 0, y: 1}, {x: 0, y: 0}],
    [{ x: -1, y: 0}, {x: 0, y: 0}, {x: 1, y: 0}, {x: 1, y: 1}],
    [{ x: 1, y: 0}, {x: 0, y: 0}, {x: 0, y: 1}, {x: 0, y: 2}],
);
blocks[5] = Array(
    [{x: -1, y: 1}, {x: 0, y: 1}, {x: 1, y: 1}, {x: 1, y: 0}],
    [{x: -1, y: 0}, {x: 0, y: 0}, {x: 0, y: 1}, {x: 0, y: 2}],
    [{x: -1, y: 1}, {x: -1, y: 0}, {x: 0, y: 0}, {x: 1, y: 0}],
    [{x: 0, y: 0}, {x: 0, y: 1}, {x: 0, y: 2}, {x: 1, y: 2}],
);

blocks[6] = Array(
    [{x: 0, y: 0}, {x: 1, y: 0}, {x: 1, y: 1}, {x: 0, y: 1}],
    [{x: 0, y: 0}, {x: 1, y: 0}, {x: 1, y: 1}, {x: 0, y: 1}],
    [{x: 0, y: 0}, {x: 1, y: 0}, {x: 1, y: 1}, {x: 0, y: 1}],
    [{x: 0, y: 0}, {x: 1, y: 0}, {x: 1, y: 1}, {x: 0, y: 1}],
);

var leftBlock = Array(SEGMENT_CNT);
var ballBlock = Array(SEGMENT_CNT);

function startGame() {
    leftArea.start();
    ballArea.start();
    scoreArea.start();
}
var leftArea = {
    leftPanel : document.getElementById("left_canvas"),
    blockMatrix: Array(),
    initializeMatrix: function(){
        for (let i = 0; i < segx; i++) {
            var row = Array(segy);
            row.fill(0);
            this.blockMatrix.push(row);
        }
    },
    initializeSendBlock: function(){
        for (let i = 0 ;i < segx; i ++){
            var row = Array(SEGMENT_CNT);
            row.fill(1);
            this.sendBlock.blockArray.push(row);
        }
    },
    score: {
        level: 0,
        rowCompleteCount: 0,
        point: 0
    },
    sendBlock: {
        rowCount: 0,
        blockArray: Array()
    },
    keyStatus : {
        key: false,
        repeat: false
    },
    curItem: {
        model: Math.floor(Math.random() * 7),
        rotation: 0,
        position:{
            i: 5,
            j: 0
        }
    },
    checkCrashAssume: function(a_rotation, a_i, a_j){
        var temp = blocks[this.curItem.model][a_rotation];
        for (let i = 0; i < SEGMENT_CNT; i++) {
            var x = a_i + temp[i].x;
            var y = a_j + temp[i].y;
            if (y < 0 || y >= segy) return true;
            if (x < 0 || x >= segx) return true;
            if (this.blockMatrix[x][y] != 0) return true;
        }
        return false;
    },
    rotateC: function(){
        var assumRotation = this.curItem.rotation + 1;
        assumRotation %= 4;
        if (this.checkCrashAssume(assumRotation, this.curItem.position.i, this.curItem.position.j))
            return;
        this.curItem.rotation = assumRotation;
    },
    rotateCW: function(){
        var assumRotation = this.curItem.rotation + 3;
        assumRotation %= 4;
        if (this.checkCrashAssume(assumRotation, this.curItem.position.i, this.curItem.position.j))
            return;
        this.curItem.rotation = assumRotation;
    },
    moveLeft: function(veryLeft = false){
        if (veryLeft){
            var assumI = this.curItem.position.i;
            while (this.checkCrashAssume( this.curItem.rotation, --assumI, this.curItem.position.j) == false){}
            this.curItem.position.i = assumI + 1;
            return;
        }
        if (this.checkCrashAssume( this.curItem.rotation, this.curItem.position.i - 1, this.curItem.position.j) == false)
            this.curItem.position.i --;
    },
    moveBall: function(veryBall = false){
        if (veryBall){
            var assumI = this.curItem.position.i;
            while (this.checkCrashAssume( this.curItem.rotation, ++assumI, this.curItem.position.j) == false){}
            this.curItem.position.i = assumI - 1;
            return;
        }
        if (this.checkCrashAssume( this.curItem.rotation, this.curItem.position.i + 1, this.curItem.position.j) == false)
            this.curItem.position.i ++;
    },
    moveDown: function(veryBottom = false){

        if (veryBottom){
            var assumJ = this.curItem.position.j;
            while (this.checkCrashAssume( this.curItem.rotation, this.curItem.position.i, ++assumJ) == false){}
            this.curItem.position.j = assumJ - 1;
        }
        else if(this.checkCrashAssume( this.curItem.rotation, this.curItem.position.i, this.curItem.position.j + 1) == false){
            this.curItem.position.j ++;
            return;
        }
        this.solidifyCurrentItem();
        this.makeNewItem();
    },
    solidifyCurrentItem: function(){
        for (let i = 0; i < SEGMENT_CNT; i++) {
            var x = this.curItem.position.i + blocks[this.curItem.model][this.curItem.rotation][i].x;
            var y = this.curItem.position.j + blocks[this.curItem.model][this.curItem.rotation][i].y;
            this.blockMatrix[x][y] = 1;
        }
        var rowComplete = Array();
        for (let i = 0; i < segy; i++) {
            var cnt = 0;
            for (let j = 0; j < segx; j++) 
                cnt +=  this.blockMatrix[j][i] != 0;
            if (cnt == segx)
                rowComplete.push(i);
        }
        if (rowComplete.length == 0)
           return false;
        this.score.point += rowComplete.length * rowComplete.length * 5;
        scoreArea.clear();
        var dropRow = 0;
        for (let i = segy - 1; i >= 0; i--) {
            if (rowComplete.includes(i)){
                for (let j = 0; j < segx; j++)
                    this.blockMatrix[j][i] = 0;
                dropRow ++;
                continue;
            }
            else if (dropRow){
                for (let j = 0; j < segx; j++){
                    this.blockMatrix[j][i + dropRow] = this.blockMatrix[j][i];
                    this.blockMatrix[j][i] = 0;
                }
            }
        }
        if (rowComplete.length < 2)
            return;
        
        
        this.score.rowCompleteCount += rowComplete.length;
        this.initializeSendBlock();
        this.sendBlock.rowCount = rowComplete.length;
        let tempPrev = -1, counter = -1;
        for (let i = 0; i < SEGMENT_CNT; i++) {
            let segRow = blocks[this.curItem.model][this.curItem.rotation][i].y + this.curItem.position.j;
            let segCol = blocks[this.curItem.model][this.curItem.rotation][i].x + this.curItem.position.i
            if (rowComplete.includes(segRow)){
                if (segRow != tempPrev){
                    counter ++;
                    tempPrev = segRow;
                }
                this.sendBlock.blockArray[segCol][counter] = 0;
            }
        }
        console.log(this.sendBlock);
        if (rowComplete.length != this.sendBlock.rowCount)
            alert('bug');
        ballArea.sendMyBlock(this.sendBlock);
    },
    makeNewItem: function(){
        this.curItem = {
            model: Math.floor(Math.random() * 7),
            rotation: 0,
            position: {
                i: 5,
                j: 0
            }
        };
    },
    shapeShift: function(){
        this.curItem.model = Math.floor(Math.random() * 7);
        this.curItem.model %= MODEL_CNT;
    },
    isVeryBottom: function(){
        var temp = blocks[this.curItem.model][this.curItem.rotation];
        temp.sort(function(a, b){ return b.y - a.y});
        if (this.curItem.position.j + temp[0].y >= segy - 1)
            return true;
        return false;
    },
    moveItem: function(){
        if (this.keyStatus.key == 'w' || this.keyStatus.key == 'W') this.rotateCW();
        if (this.keyStatus.key == 's' || this.keyStatus.key == 'S')  this.rotateC();
        if (this.keyStatus.key == 'a' || this.keyStatus.key == 'A')  this.moveLeft(this.keyStatus.repeat);
        if (this.keyStatus.key == 'd' || this.keyStatus.key == 'D')  this.moveBall(this.keyStatus.repeat);
        if (this.keyStatus.key == 'Control')  this.moveDown(true);
        if (this.keyStatus.key == 'Shift')  this.shapeShift();
        
        leftArea.clear();
        leftArea.drawBlockMatrix();
        leftArea.drawDropItem();
    },
    start : function() {
        this.initializeMatrix();
        this.leftPanel.width = sx * segx;
        this.leftPanel.height = sy * segy;
        this.leftPanel.id = "left-panel";
        this.context = this.leftPanel.getContext("2d");
        
        this.interval = setInterval(this.updateLeftArea, interval);
        window.addEventListener('keydown', function (e) {
            if (e.key == leftArea.keyStatus.key)
                leftArea.keyStatus.repeat = true;
            leftArea.keyStatus.key = e.key;
            leftArea.moveItem();
        });
        window.addEventListener('keyup', function (e) {
            leftArea.keyStatus.key = false;
            leftArea.keyStatus.repeat = false;
        });

        this.clear();
    },
    
    clear : function(){
        this.context.clearRect(0, 0, this.leftPanel.width, this.leftPanel.height);
        var i, j, step_y = this.leftPanel.height / segy, step_x = this.leftPanel.width / segx;
        this.context.lineWidth = 2;
        this.context.strokeStyle = "#ff000033";
        this.context.lineCap = "round";
        this.context.beginPath();
        for (let i = 1; i < segy; i++) {
            this.context.moveTo(0, i * step_y);
            this.context.lineTo(this.leftPanel.width, i * step_y);
        }
        for (let j = 1; j < segx; j++) {
            this.context.moveTo(j * step_x, 0 );
            this.context.lineTo(j * step_x, this.leftPanel.height );
        }
        this.context.stroke();
    },
    drawBlockMatrix: function(){
        for (let i = 0; i < segx; i++) {
            for (let j = 0; j < segy; j++) {
                if (this.blockMatrix[i][j] == 0)
                    continue;
                this.context.fillStyle = itemColors[this.blockMatrix[i][j]];
                this.context.fillRect(i * sx, j * sy, sx, sy);
                this.context.strokeRect(i * sx, j * sy, sx, sy);
            }
        }
    },
    drawDropItem: function(){
        var i;
        for (let i = 0; i < SEGMENT_CNT; i++) {
            this.context.fillStyle = itemColors[this.curItem.model];
            var x = blocks[this.curItem.model][this.curItem.rotation][i].x + this.curItem.position.i;
            var y = blocks[this.curItem.model][this.curItem.rotation][i].y + this.curItem.position.j;
            this.context.fillRect(x * sx, y * sy, sx, sy);
            this.context.strokeRect(x * sx, y * sy, sx, sy);
            this.context.fillStyle = "White";
            this.context.fillRect(x * sx + 10, y * sy + 10, 10, 3);
        }
    },
    updateLeftArea: function(){
        leftArea.moveDown();
        leftArea.clear();
        leftArea.drawBlockMatrix();
        leftArea.drawDropItem();
    }
}

var ballArea = {
    ballPanel : document.getElementById("ball_canvas"),
    ball: {
        color: "Red",
        position: {
            i: 0,
            j: segy - 1
        },
        speed: {
            i: 0.1,
            j: -0.1,
        },
        tail: document.createElement('img')
    },
    blockMatrix: Array(segx),
    start : function() {
        this.ballPanel.width = sx * segx;
        this.ballPanel.height = sy * segy;
        this.ballPanel.id = "ball-panel";
        this.ball.tail.src = "./assets/favicon.png";
        this.context = this.ballPanel.getContext("2d");
        
        this.interval = setInterval(this.updateBallArea, interval / 50);
        this.clear();
        this.drawBall();
    },
    sendMyBlock: function(otherBlock){
        let receiveCount = otherBlock.rowCount;
        let recevieArray = otherBlock.blockArray;

        let newBlock = Array();
        //this.blockMatrix.push(recevieArray);
        for (let i = 0; i < segx; i++) {
            let row = Array(receiveCount);
            for (let j = 0; j < receiveCount; j++) {
                row[j] = recevieArray[i][j];
            }
            //newBlock.push(row);
            this.blockMatrix[i].push(row);
        }
    },
    moveBall: function(){
        this.ball.position.i += this.ball.speed.i;
        this.ball.position.j += this.ball.speed.j;
        if (this.ball.position.i <= 0 || this.ball.position.i >= segx - 1){
            this.ball.color = itemColors[Math.floor(Math.random() * MODEL_CNT)];
            this.ball.speed.i = - this.ball.speed.i;
        }
        if (this.ball.position.j <= 0 || this.ball.position.j >= segy - 1){
            this.ball.color = itemColors[Math.floor(Math.random() * MODEL_CNT)];
            this.ball.speed.j = - this.ball.speed.j;
        }
    },
    updateBallArea: function(){
        ballArea.moveBall();
        ballArea.clear();
        ballArea.drawBall();
        ballArea.drawBlockMatrix();
    },
    clear : function(){
        this.context.clearRect(0, 0, this.ballPanel.width, this.ballPanel.height);
        var i, j, step_y = this.ballPanel.height / segy, step_x = this.ballPanel.width / segx;
        this.context.lineWidth = 2;
        this.context.strokeStyle = "#ff000033";
        this.context.lineCap = "round";
        this.context.beginPath();
        for (let i = 1; i < segy; i++) {
            this.context.moveTo(0, i * step_y);
            this.context.lineTo(this.ballPanel.width, i * step_y);
        }
        for (let j = 1; j < segx; j++) {
            this.context.moveTo(j * step_x, 0 );
            this.context.lineTo(j * step_x, this.ballPanel.height );
        }
        this.context.stroke();
    },
    
    drawBlockMatrix: function(){
        for (let i = 0; i < this.blockMatrix.length; i++) {
            if (this.blockMatrix[i])
            for (let j = 0; j < this.blockMatrix[i].length; j++) {
                if (this.blockMatrix[i][j] == 0)
                    continue;
                this.context.fillStyle = itemColors[this.blockMatrix[i][j]];
                this.context.fillRect(i * sx, j * sy, sx, sy);
                this.context.strokeRect(i * sx, j * sy, sx, sy);
            }
        }
    },
    drawBall: function(){
        this.context.strokeStyle = "Lime";
        this.context.beginPath();
        var x = this.ball.position.i;
        var y = this.ball.position.j;
        
        this.context.translate(x * sx, y * sy + sy+ sy);
        var angle;
        if (this.ball.speed.i > 0){
            angle = 2700 * this.ball.speed.i + 450 * this.ball.speed.j;
        }else{
            angle = -1800 * this.ball.speed.i + 450 * this.ball.speed.j;
        }
        //console.log(angle);
        this.context.rotate(angle * Math.PI / 180);
        // this.context.drawImage(this.ball.tail, 0, 0, sx, sy);

        this.context.rotate(-angle * Math.PI / 180);
        this.context.translate(-x * sx, -y * sy - sy- sy);

        var grd = this.context.createRadialGradient(x * sx + sx / 3, y * sy + sy / 3, 4, x * sx + sx, y * sy + sy, 50);
        grd.addColorStop(0, this.ball.color);
        grd.addColorStop(1, "white");
        this.context.fillStyle = grd;
        this.context.arc(x * sx + sx / 2, y * sy + sy / 2, sx / 2, 0 , Math.PI * 2, true);
        this.context.fill();
    }
}

var scoreArea = {
    scorePanel: document.getElementById("score_canvas"),
    start: function(){
        this.context = this.scorePanel.getContext("2d");
        this.context.fillStyle = "Bisque";
        this.clear();
    },
    clear: function(){
        this.context.clearRect(0, 0, this.scorePanel.width, this.scorePanel.height);
        this.context.textAlign = "center";
        this.context.font = "30px Comic Sans MS";
        this.context.fillText("Level:" + leftArea.score.level, 100, 60);
        this.context.fillText("Score:" + leftArea.score.point, 100, 120);
    }
}