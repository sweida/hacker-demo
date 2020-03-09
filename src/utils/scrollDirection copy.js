// 获取屏幕滑动方向
var startx, starty, endx, endy;

//获得角度
function getAngle(angx, angy) {
  return (Math.atan2(angy, angx) * 180) / Math.PI;
}

//根据起点终点返回方向 1向上 2向下 3向左 4向右 0未滑动
function getDirection(startx, starty, endx, endy) {
  var angx = endx - startx;
  var angy = endy - starty;
  var result = 0;

  //如果滑动距离太短
  if (Math.abs(angx) < 5 && Math.abs(angy) < 5) {
    return result;
  }
  var angle = getAngle(angx, angy);
  if (angle >= -135 && angle <= -45) {
    result = "up";
  } else if (angle > 45 && angle < 135) {
    result = "down";
  } else if (
    (angle >= 135 && angle <= 180) ||
    (angle >= -180 && angle < -135)
  ) {
    result = "left";
  } else if (angle >= -45 && angle <= 45) {
    result = "right";
  }
  return result;
}

function touchStart() {
  startx = e.touches[0].pageX;
  starty = e.touches[0].pageY;
  return [startx, starty]
}

function touchEnd() {
  endx = e.changedTouches[0].pageX;
  endy = e.changedTouches[0].pageY;
  return [endx, endy]
}
getDirection(...touchStart(), ...touchEnd());


//手指接触屏幕
document.addEventListener( "touchstart", touchStart(), false);
//手指离开屏幕
document.addEventListener( "touchend", touchEnd(), false);
