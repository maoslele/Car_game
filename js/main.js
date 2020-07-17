let c = document.createElement("canvas");
let ctx = c.getContext("2d"); //canvasのコンテキストを取得する 2d = ２次元
c.width = 600;
c.height = 400;


document.body.appendChild(c); //追加したコンテキストをbodyに追加

//斜面描画

let perm = [];
while (perm.length < 255) {
  { //255の数字がpermの配列に入れる
    while (perm.includes(val = Math.floor(Math.random() * 255))); //valに0~255が入る
    perm.push(val);
  }
}

let lerp = (a, b, t) => a + (b - a) * (1 - Math.cos(t * Math.PI)) / 2 ; //lerpは線形分離 ベクトルaとbの間にtを設定 ここの変数をいじることで凸凹具合の造形を変えられる
let noise = x => {
  x = x *0.01 % 255;
  return lerp(perm[Math.floor(x)], perm[Math.ceil(x)], x - Math.floor(x)); //斜面のアルゴリズム
}
 let player = new function() {
   this.x = c.width / 2; //キャンバスの中央
   this.y = 0;
   this.ySpeed = 0;
   this.rot = 0;//rotation 回転の角度
   this.rSpeed = 0;

   this.img = new Image();
   this.img.src = "image/car.png";

   this.draw = function() { //描画関数
    let p1 = c.height - noise(t + this.x) * 0.25; //山の斜面の境界
    let p2 = c.height - noise(t + 5 + this.x) * 0.25; //山の斜面の境界
    
    let grounded = 0;

    if(p1 > this.y) { //山の斜面の境界に接置するかどうか
      this.ySpeed += 0.1;
    } else {
      this.ySpeed -= this.y - (p1 - 5); //地面についたら降下しない, バウンドの幅指定
      this.y = p1 - 15; //playerと山の斜面を同じ座標にする　タイヤが練りこまねいように-
      
      grounded = 1;
    }

    if(!playing || grounded && Math.abs(this.rot) > Math.PI * 0.5){
        playing = false;
        this.rSpeed = 5;
        k.ArrowUp = 1;
        this.x -= speed * 2.5;
    }
    let angle = Math.atan2((p2 - 15) - this.y, (this.x + 5) - this.x);//atan2で座標がわかる
    //this.rot = angle;

    this.y += this.ySpeed;
    if (grounded && plating) {
      this.rot -= (this.rot - angle) * 0.5;
      this.rSpeed = this.rSpeed  - (angle - this.rot);
    }

    this.rSpeed += (k.ArrowLeft - k.ArrowRight) * 0.5
    this.rot += this.rSpeed * 0.1;

    if (this.rot > Math.PI) this.rot = -Math.PI;
    if (this.rot < -Math.PI) this.rot = Math.PI;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rot);
    ctx.drawImage(this.img, -15,  -15, 50, 50); //どのイメージ、x座標、y座標

    ctx.restore();
   }

 }

let t = 0;
let speed = 0;
let playing = true;
let k = {ArrowUp: 0, ArrowDown: 0, ArrowLeft: 0, ArrowRight: 0};
function loop() {
  //ループするごとに値が変わるので、lineToのnoiseに入れるとアニメーションするように見える
  speed -= (speed - (k.ArrowUp - k.ArrowDown)) * 0.1;
  t += 5 * speed; 
  ctx.fillStyle = "yellowgreen"; //塗りつぶし
  ctx.fillRect(0, 0, c.width, c.height);//長方形を描画する

  ctx.fillStyle = "black" //山の斜面の塗りつぶし

  ctx.beginPath();  //線を描画する時は最初に宣言する
  ctx.moveTo(0, c.height);

  for (let i = 0; i < c.width; i++) {//山の斜面を左隅から右角に描画していく
    ctx.lineTo(i, c.height - noise(t + i) * 0.25); //直前の座標と指定座標を結ぶ直線を引く
  }

  ctx.lineTo(c.width, c.height);

  ctx.fill(); //塗りぶし
  player.draw();
  requestAnimationFrame(loop); //再帰的に関数が呼ばれる
}

onkeydown = d => k[d.key] = 1;
onkeyup = d => k[d.key] = 0;

loop();
