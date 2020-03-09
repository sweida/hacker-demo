class Direction {
  constructor() {
    this.direction = '' // 滑动方向
  }

  //获得角度
  getAngle(angX, angY) {
    return (Math.atan2(angY, angX) * 180) / Math.PI;
  }

  //根据起点终点返回方向 1向上 2向下 3向左 4向右 0未滑动
  getDirection(startX, startY, endX, endY) {
    let angX = endX - startX;
    let angY = endY - startY;

    //如果滑动距离太短
    if (Math.abs(angX) < 3 && Math.abs(angY) < 3) {
      return false;
    }
    let angle = this.getAngle(angX, angY);
    if (angle >= -135 && angle <= -45) {
      this.direction = "up";
    } else if (angle > 45 && angle < 135) {
      this.direction = "down";
    } else if (
      (angle >= 135 && angle <= 180) ||
      (angle >= -180 && angle < -135)
    ) {
      this.direction = "left";
    } else if (angle >= -45 && angle <= 45) {
      this.direction = "right";
    }
    return this.direction;
  }
}


export const getTouchDirection = (startX, startY, endX, endY) => {
  let direction = new Direction();
  return direction.getDirection(startX, startY, endX, endY);
};