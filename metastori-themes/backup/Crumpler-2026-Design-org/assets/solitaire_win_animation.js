document.addEventListener("DOMContentLoaded", function () {
  $(".solitaire_win_btn").click(function () {
    $(".solitary_popup").show();
    solitaryAnimation();
    $('body').css('overflow', 'hidden');
  });

    $(window).on("scroll", function () {
        let scrollTop = $(window).scrollTop();
        if(scrollTop == 0){
          $('.solitary_popup').css('top','60px');
        }else{
          $('.solitary_popup').css('top','40px');
        }
    });


  function solitaryAnimation() {
    if (!window.requestAnimationFrame) {
      window.requestAnimationFrame = (function () {
        return (
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame ||
          window.oRequestAnimationFrame ||
          window.msRequestAnimationFrame ||
          function (callback, element) {
            window.setTimeout(callback, 1000 / 60);
          }
        );
      })();
    }
    
    function start() {
      reset();
      animate();
    }
    
    f = 3;
    imgload = function () {
      f--;
      if (f == 0) {
        start();
      }
    };
    
    var iBg = new Image();
    iBg.onload = imgload;
    iBg.src = "https://i.imgur.com/fPH6QI7.png";
    var iCards = new Image();
    iCards.onload = imgload;
    iCards.src = "https://i.imgur.com/XZlSH3r.png";
    var iSpot = new Image();
    iSpot.onload = imgload;
    iSpot.src = "https://i.imgur.com/LP5T0IN.png";
    
    var c = document.getElementById("laggyCanvas");
    var ctx = c.getContext("2d");
    //ctx.translate(0.5,0.5);
    //draw bg
    var goals = [3, 1, 2, 0],
      spot,
      value,
      vx,
      vy,
      cx,
      cy;
    
    function shuffle(o) {
      //v1.0
      for (
        var j, x, i = o.length;
        i;
        j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x
      );
      return o;
    }
    
    function reset() {
      djk = [0, 256, 512, 768];
      // for (j = 0; j < 4; j++)
      //   for (k = 0; k < 4; k++) ctx.drawImage(iBg, djk[j], djk[k]);
    
      //draw kings and lets get started
      goals = shuffle(goals);
      for (g = 0; g < 4; g++)
        ctx.drawImage(
          iCards,
          12 * 71, //Sprite X
          goals[g] * 96, //Sprite Y
          71,
          96,
          450 + g * 80, //on screen X
          10, //on screen Y
          71,
          96
        );
    
      spot = 0;
      value = 12;
    
      vx = -4;
      vy = 4;
      cx = 450;
      cy = 10;
      decay = 0.2;
    }
    speed = 1; //.5
    decaydecay = 1; //.5
    function draw() {
      cx += vx * speed;
      cy += vy * speed;
      vy += decay * decaydecay;
    
      //bounce
      if (cy >= 600 - 96) {
        cy = 600 - 96;
        vy = vy * -1 * 0.7 + (1.0 - Math.random() * 2.0); //(Math.random() *2)
        if (vy > 0.1) vy = -1;
      }
    
      //nextcard
      if (cx <= -71 || cx >= 800) {
        spot++;
        if (spot >= 4) {
          spot = 0;
          value--;
        }
        decay = 0.3;
        vx = 4 * (1 - Math.random() * 2);
        if (vx > 0) vx += 1;
        else vx -= 1;
        vy = 4 * Math.random();
        cx = 450 + spot * 80;
        cy = 10;
      }
      ctx.drawImage(
        iCards,
        value * 71, //Sprite X
        goals[spot] * 96, //Sprite Y
        71,
        96,
        Math.round(cx + 0.5), //on screen X
        Math.round(cy + 0.5), //on screen Y
        71,
        96
      );
    }
    
    function animate() {
      if (value < 0) {
        reset();
      }
      requestAnimationFrame(animate);
      draw();
    }
  }
});
