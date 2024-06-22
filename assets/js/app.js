
let canvas =document.getElementById("canvas");
let canvasCT =canvas.getContext("2d"); 
let winwidth = window.innerWidth;   //画面の横幅
let winheight = window.innerHeight; //画面の縦幅
canvas.width = winwidth;
canvas.height = winheight;

canvasCT.fillStyle = "black"; 
canvas.style.border = "4px solid #555" 
canvas.style.backgroundColor="green"
let     MouseSelect = new Array(10); //マウスの選択ボタン(T,F)
let mouseX ;
let mouseY ;
const   INTERVAL = 50;  //１コマ間隔
const   SECOND = 1000 / INTERVAL;   //1秒
let TopTime = 0;        //コマ
let Time = 0;           //秒
let StartTime = 3;      //カウントダウン
let TimerOn = true;     //時間制限有無
const   gKey = new Uint8Array( 0x100 ); //キー入力バッファ




//初期情報
let GameState = "title"; 
let GameMode = 4;   //0:ノーマル 1:ハード 2:ノーミス 3:エンドレス 4:カスタム
let TimeLimit = 60*2;    //時間制限の場合のタイムリミット(秒)
let HeartNumMax = 4;    //最大残機数
let Heart = HeartNumMax;    //残機
let GameSpeed = 1000; //gamespeed
//問題文関連
let space = 0

let questionText = ["apple","banana","melon","mango","starwberry","blueberry","orange"] ;        //問題文
let quesCol = 0;    //列目
let quesLin = Math.floor( Math.random() * questionText.length);    //行目
let quesText = questionText[quesLin];   //現在の問題文1行
let typ = quesText[quesCol];                       //現在の問題文字
const   TypeText = [['']];  //タイプ例配列[行][列]          //回答
//スコア関連
let NumType = 0;        //タイプした回数
let Miss = 0;           //ミスした回数



function drawAll(){
    canvasCT.clearRect(0,0,canvas.width,canvas.height);
    if(winwidth > winheight)bs = winheight / 17;     //縦幅が横幅より小さいとき1マスを縦幅/17にする
        else bs = winwidth / 17;  

        canvasCT.font = bs+"px monospace"; 

    if(GameState == "title"){
        drawTitle();
        
    } else if(GameState == "Ready" || GameState =="Game"){
        drawGame();
    } else if (GameState == "Finish"){
        drawFinish();
    }

    if(GameState == "Ready"){
        drawReady();
    }
}
function drawTitle(){
    canvasCT.fillStyle = "white";                              
    canvasCT.fillText("ゲームモードを選んでください",bs*1,bs*1);   
    canvasCT.fillStyle = "white";                //水色の
    canvasCT.fillRect(bs*2,bs*2,bs*6,bs*1.3);      //ノーマルボタン
    canvasCT.fillRect(bs*2,bs*5,bs*6,bs*1.3);      //ハードボタン
    canvasCT.fillRect(bs*2,bs*8,bs*6,bs*1.3);      //ノーミスボタン
    canvasCT.fillRect(bs*10,bs*2,bs*6,bs*1.3);      //エンドレスボタン
    canvasCT.fillRect(bs*10,bs*5,bs*6,bs*1.3);      //カスタムボタン
    canvasCT.fillRect(bs*2,bs*13.5,bs*11,bs*1.5);  //決定ボタン　↓選択中はオレンジで
    if(MouseSelect[0])canvasCT.fillStyle = "orange"; 
        else canvasCT.fillStyle = "black"; 
    canvasCT.fillText("ノーマル",bs*3,bs*3); //ボタン名
    if(MouseSelect[1]) canvasCT.fillStyle = "orange"; 
        else  canvasCT.fillStyle = "black"; 
    canvasCT.fillText("ハード",bs*3.5,bs*6);       //ボタン名
    if(MouseSelect[2]) canvasCT.fillStyle = "orange"; 
        else canvasCT.fillStyle = "black"; 
    canvasCT.fillText("ノーミス",bs*3,bs*9);         //ボタン名
    if(MouseSelect[3])canvasCT.fillStyle = "orange"; 
        else canvasCT.fillStyle = "black"; 
    canvasCT.fillText("エンドレス",bs*10.5,bs*3); //ボタン名
    if(MouseSelect[4]) canvasCT.fillStyle = "orange"; 
        else  canvasCT.fillStyle = "black"; 
    canvasCT.fillText("カスタム",bs*11,bs*6);       //ボタン名
    if(MouseSelect[5]){
        canvasCT.fillStyle = "red"; 
        canvasCT.fillRect(bs*2,bs*13.5,bs*11,bs*1.5); 
    }
    if(MouseSelect[5]) canvasCT.fillStyle = "white"; 
        else canvasCT.fillStyle = "red"; 
    canvasCT.fillText("決定(press space key)",bs*2.5,bs*14.6);    //ボタン名↑選択中は白で
    
    fillTextLine ("残機 無制限 \n制限時間２分","white",bs/3*2, bs*2.5, bs*4);
    fillTextLine ("残機数４ \n制限時間２分","white",bs/3*2, bs*2.5, bs*7);
    fillTextLine ("残機数１ \n制限時間２分","white",bs/3*2, bs*2.5, bs*10);
    fillTextLine ("残機 無制限 \n制限時間 無制限","white",bs/3*2, bs*10.5, bs*4);
    
    canvasCT.strokeStyle = "red"; //赤の[]
    canvasCT.lineWidth=5;
    if(GameMode < 3) canvasCT.strokeRect(bs*1.8,bs*1.9+GameMode*bs*3,bs*6.5,bs*1.5); 
        else  canvasCT.strokeRect(bs*9.8,bs*1.9+(GameMode-3)*bs*3,bs*6.5,bs*1.5);//選択枠
    if(GameMode == 4 ){
        mint = Math.floor(TimeLimit/60);    //分の変数
        canvasCT.fillStyle = "white";   
        canvasCT.fillRect(bs*10,bs*6.8,bs*10,bs*4.5); 
        fillTextLine ("   残機 \n \n \n 制限時間","black",bs/3*2, bs*10.5, bs*8.2);
        fillTextLine ("- \n \n \n-","black",bs/3*2, bs*14.5, bs*8.2);
        fillTextLine ("+ \n \n \n+","black",bs/3*2, bs*18.5, bs*8.2);
        if(TimeLimit%60!=0) canvasCT.fillText(mint+"分"+Math.floor(TimeLimit%60)+"秒",bs*15.5,bs*10.2); 
            else if(TimeLimit == 0) canvasCT.fillText("無制限",bs*15.6,bs*10.2); 
            else canvasCT.fillText(mint+"分",bs*16.2,bs*10.2);  
        if(HeartNumMax != 0)canvasCT.fillText(HeartNumMax,bs*16.5,bs*8.2);
            else  canvasCT.fillText("無制限",bs*15.6,bs*8.2);

    }

    
    

}
function drawReady(){
    canvasCT.fillStyle = "red";
    canvasCT.font = bs*3+"px monospace"; 
    canvasCT.fillText(StartTime,bs*7,bs*7); 
}

function drawGame(){
    if(GameState == "Game" && Time < 1){
        canvasCT.font = bs*3+"px monospace"; 
        canvasCT.fillStyle = "rgba(255,0,0,"+(1-TopTime/SECOND)+")";   //徐々に透明に
        canvasCT.fillText("START!",bs*4,bs*7);
        
    }
    canvasCT.font = bs*2+"px monospace"; 
    space = 0;
    canvasCT.fillStyle = "orange";
    for(i=0;i<quesText.length;i++){
        if(i==quesCol) canvasCT.fillStyle="turquoise";
        else if(i>quesCol) canvasCT.fillStyle="black";
        
        canvasCT.fillText(quesText[i],bs*(4.5+space),bs*6.5);
        code = quesText[i].charCodeAt(0);
        if(code <= 255 )space += 1.2;
        else space += 3;
    }
    canvasCT.font = bs*1+"px monospace"; 
    space = 0;
    canvasCT.fillStyle = "black";
    canvasCT.fillText(quesText,bs*4.5,bs*4)

    canvasCT.fillStyle = "white";
    if(HeartNumMax == 0) canvasCT.fillText("残機：∞",bs*2,bs*1.2); 
    else canvasCT.fillText("残機："+ Heart,bs*0.5,bs*1.2); 
    if(TimeLimit == 0) canvasCT.fillText(Time +"秒経過",bs*14,bs*1+bs/4);
    else canvasCT.fillText("残り"+(TimeLimit-Time) +"秒",bs*14,bs*1+bs/4);

}

function drawFinish(){
    fillTextLine("しゅーりょー","white",bs*1.8,bs*5,bs*2); 
    fillTextLine("タイプ数  ："+ NumType +"回"+"\n"+ "Miss数    ："+ Miss +"回"+"\n"+"経過時間  ："+ Time +"秒"+"\n"+"タイプ速度："+ Math.floor((NumType/Time)*100)/100 +"回/秒","white",bs*1,bs*2,bs*4 );
    fillTextLine("同じ設定でリトライ → Spaceキー \nゲームモード選択   → Enterキー","white",bs*1.2,bs*2,bs*10);
}

function State()
{
    if(GameState == "Ready"){
        
        TopTime++;
        if(TopTime >= SECOND){
            StartTime--;
            TopTime = 0;
            if(StartTime <= 0){
                StartTime = 3;
                GameState = "Game";
            }
        }
    }else if(GameState=="Game"){
        if(TimerOn){
            TopTime ++;
            if(TopTime >= SECOND){
                Time++;
                TopTime = 0;
            }    
        }
        if(TimeLimit != 0){  //時間制
            if(Time >= TimeLimit){
                GameState = "Finish";
                //if(option[4])SEFinish.play(0.1);
            }
        }
    }
}

window.onload = function()
{
    document.body.addEventListener("mousemove",function(e){
    });
    this.document.body.addEventListener("mouseleave",function(e){
    });
    
    setInterval( function(){ 
        Timer() 
    },INTERVAL);      //33ms間隔でWmTimer()を呼び出させる(約30.3fps)

}

function Timer()
{
    //winwidth = window.innerWidth;
    //winheight = window.innerHeight;
    State();
    drawAll();
    //OperationConfirmation();
}

function fillTextLine (text,c,size, x, y) {
    canvasCT.fillStyle = c; 
    canvasCT.font = size+"px monospace"; 
    let textList = text.split('\n');        //　textは\nで分割
    let lineHeight = canvasCT.measureText("あ").width;// あ　はフォントのサイズを取得するのに利用
    textList.forEach(function(text, i) {                //配列を順番に読み出して、y（高さ）を計算しながら描画
    canvasCT.fillText(text, x, y+lineHeight*i);
    });
};

window.onmousemove = function(e){
    mouseX = e.pageX;
    mouseY = e.pageY-66;
    if(GameState=="title"){
        for(s=0; s < MouseSelect.length; s++){ 
            MouseSelect[s] = false; 
        }
        if( mouseX>=bs*2 && mouseX<=bs*8 && mouseY>=bs*2 && mouseY <= bs*3.3 ){
            MouseSelect[0] = true;  //ノーマル
        }else if(mouseX>=bs*2 && mouseX<=bs*8 && mouseY>=bs*5 && mouseY <= bs*6.3){
            MouseSelect[1] = true;  //ハード
        }else if(mouseX>=bs*2 && mouseX<=bs*8 && mouseY>=bs*8 && mouseY <= bs*9.3){
            MouseSelect[2] = true;  //ノーミス
        }else if(mouseX>=bs*10 && mouseX<=bs*16 && mouseY>=bs*2 && mouseY <= bs*3.3){
            MouseSelect[3] = true;  //エンドレス
        }else if(mouseX>=bs*10 && mouseX<=bs*16 && mouseY>=bs*5 && mouseY <= bs*6.3){
            MouseSelect[4] = true;  //カスタム
        }else if(mouseX>=bs*2 && mouseX<=bs*13 && mouseY>=bs*13.5 && mouseY <= bs*15){
            MouseSelect[5] = true;　//決定
        }else if(GameMode == 4){    //カスタム設定
            if( mouseX>=bs*13.7 && mouseX<=bs*15.3 && mouseY>=bs*7.6 && mouseY <= bs*8.8 ){
                MouseSelect[6] = true;  //残機-ボタン
            }else if(mouseX>=bs*17.7 && mouseX<=bs*19.3 && mouseY>=bs*7.6 && mouseY <= bs*8.8 ){
                MouseSelect[7] = true;  //残機+ボタン
            }else if( mouseX>=bs*13.7 && mouseX<=bs*15.3 && mouseY>=bs*9.6 && mouseY <= bs*10.8 ){
                MouseSelect[8] = true;  //時間-ボタン
            }else if(mouseX>=bs*17.7 && mouseX<=bs*19.3 && mouseY>=bs*9.6 && mouseY <= bs*10.8 ){
                MouseSelect[9] = true;  //時間+ボタン
            }               
        }
    }

}

window.onmousedown = function(e){
    //座標を取得する
    mouseX = e.pageX;  //X座標
    mouseY = e.pageY-66;  //Y座標
    if(GameState == "title"){  //モード選択画面の場合
        if(MouseSelect[0]){ GameMode = 0; HeartNumMax = 0 ;TimeLimit = 120;}         //ノーマルに変更
        else if(MouseSelect[1]){ GameMode = 1; HeartNumMax = 4; TimeLimit = 120; }    //ハードに変更
        else if(MouseSelect[2]){ GameMode = 2; HeartNumMax = 1; TimeLimit = 120;}    //ノーミスに変更
        else if(MouseSelect[3]){ GameMode = 3; HeartNumMax = 0 ;TimeLimit = 0;}    //エンドレスに変更
        else if(MouseSelect[4]){ GameMode = 4; }    //カスタムに変更
        else if(MouseSelect[5]){                    //決定
            for(let s = 0; s < MouseSelect.length; s++){ MouseSelect[s] = false; }
            GameState = "Ready"; //準備完了画面へ
        } else if(MouseSelect[6]){ 
            if(HeartNumMax > 0)HeartNumMax --;
                else if (HeartNumMax == 0) HeartNumMax = 99;
        } else if(MouseSelect[7]){ 
            if(HeartNumMax < 99)HeartNumMax ++;
                else if(HeartNumMax == 99)HeartNumMax = 0;
        } else if(MouseSelect[8]){ 
            if(TimeLimit > 0) TimeLimit -= 30;
                else if(TimeLimit == 0) TimeLimit = 5970;
        } else if(MouseSelect[9]){ 
            if(TimeLimit < 5970)TimeLimit += 30;
                else if(TimeLimit == 5970) TimeLimit = 0;
        } 
    }
}

window.document.onkeydown = function (event){

	if(GameState=="Game"){
        if(event.key == quesText[quesCol]) {
            quesCol ++ ;
            NumType ++;
        } else if(HeartNumMax != 0 && Heart != 1){ 
            Heart --; 
            Miss ++;
        } else if(HeartNumMax != 0 && Heart == 1) GameState="Finish";

        if(quesCol == quesText.length){
            quesCol=0
             quesLin = Math.floor( Math.random() * questionText.length);    //行目
             quesText = questionText[quesLin];
        }
    }else if(GameState=="title"){
        if(event.key == " ") GameState = "Ready";
    }else if(GameState="Finish"){
         if(event.key == " ") {
           
            scoreReset();
            GameState = "Ready";
        } else if(event.key == "Enter") {
           
            scoreReset();
            GameState = "title";
        }
    }


	
}

function scoreReset(){
    Heart = HeartNumMax;
    NumType = 0;
    Miss = 0;
    quesCol = 0;
    Time = 0;
}

function OperationConfirmation(){
    canvasCT.fillStyle="white";
    canvasCT.font= bs*1+"px monospace"; 
     canvasCT.fillText("GameMode:"+ GameMode,bs*25,bs*14.6); //動作確認用
     canvasCT.fillText("残機数:"+ HeartNumMax,bs*25,bs*12.6); //動作確認用
     //canvasCT.fillText(MouseSelect,bs*15,bs*12.6); //動作確認用
     canvasCT.fillText(NumType,bs*30,bs*2); //動作確認用
     canvasCT.fillText(Miss,bs*30,bs*3); //動作確認用
     canvasCT.fillText(Time,bs*30,bs*4); //動作確認用
     canvasCT.fillText(Heart,bs*30,bs*5); //動作確認用
     canvasCT.fillText(quesCol,bs*30,bs*6); //動作確認用
     canvasCT.fillText(GameState,bs*30,bs*7);



}