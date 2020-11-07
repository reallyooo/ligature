// 两个向量是否相等
const isEq = (a, b) => a[0] === b[0] && a[1] === b[1];

// 是否平行
const isParallel = (a, b) => a[0] * b[1] + a[1] * b[0] === 0;

// 是否方向相反
const isReverse = (a, b) => a[0] + b[0] === 0 && a[1] + b[1] === 0;

// 把正负数和0 转换为 -1 0 1 表示
const getHeatos = num => num > 0 ? 1 : num < 0 ? -1 : 0;

// 获取目标方向
const getDirection = (start, target) => { 
  const vq = [target.x - start.x, target.y - start.y]; // 向量
  const vs = [getHeatos(vq[0]), getHeatos(vq[1])]; // 直接方向
  return { vq, vs, v: [0, vs[1]], s: [vs[0], 0] }; // v 垂直方向 s 水平方向
}

// 获取路径点 出发点、目标点、出发点方向、目标点进入方向、延长线长度
// 上 => [0, -1]; 右 => [1, 0]; 下 => [0, 1]; 左 => [-1, 0]; 
// 左上 => [-1, -1]; 右上 => [1, -1]; 右下 => [1, 1]; 左下 => [-1, 1];
const getPoints = (start, target, sd, td, extend = 20) => {
  const { vq, vs, v, s } = getDirection(start, target)
  // 0个转折点 一条直线
  // 条件：出发点方向和直接方向相等
  if (isEq(sd, vs)) return [vq];
  if (vs[0] === 0) vs[0] = s[0] = 1;
  if (vs[1] === 0) vs[1] = v[1] = 1;

  // 1个转折点 
  // 条件：1、出发点方向和目标点进入方向垂直
  //       2、直接方向的水平方向或者垂直方向与出发点方向相等
  //       3、另一不相等方向与目标点方向同向
  if (!isParallel(sd, td)) {
    if (isEq(sd, v) && !isReverse(td, s)) return [ [0, vq[1]], [vq[0], 0] ];
    else if (isEq(sd, s) && !isReverse(td, v)) return [ [vq[0], 0], [0, vq[1]] ];
  }

  // 2个转折点
  // 条件：1、出发点方向和目标点进入方向平行
  //       2、如果出发点方向与直接方向中垂直方向或水平方向平行的方向相反，则出发点方向与目标点进入方向必须相反
  if (isParallel(sd, td)) {
    if (isParallel(sd, v)) {
      let second = [vq[0], 0];
      if (isReverse(sd, v)) {
        if (isReverse(sd, td)) return [ [0, extend * sd[1]], second, [0, vq[1] + extend * td[1]] ];
      } else {
        if (isReverse(sd, td)) return [ [0, vq[1] + extend * sd[1]], second, [0, extend * td[1]] ];
        else return [ [0, vq[1] / 2], second, [0, vq[1] / 2] ];
      }
    } else {
      let second = [0, vq[1]];
      if (isReverse(sd, s)) {
        if (isReverse(sd, td)) return [ [extend * sd[0], 0], second, [vq[0] + extend * td[0], 0] ];
      } else {
        if (isReverse(sd, td)) return [ [vq[0] + extend * sd[0], 0], second, [extend * td[0], 0] ];
        else return [ [vq[0] / 2, 0], second, [vq[0] / 2, 0] ];
      }
    }
  }

  // 3个转折点
  // 条件：1、出发点方向和目标点进入方向垂直
  //       2、如果出发点方向与直接方向中垂直方向或水平方向平行的方向相同，则出发点方向与目标点进入方向必须相反
  if (!isParallel(sd, td)) {
    if (isParallel(sd, v)) {
      let first = [0, extend * sd[1]];
      let last = [extend * td[0], 0];
      if (isReverse(sd, v)) {
        if (isReverse(td, s)) return [ first, [vq[0] + extend * s[0], 0], [0, vq[1] + extend * v[1]], last ];
        else return [ first, [vq[0] - extend * s[0], 0], [0, vq[1]  + extend * v[1]], last ];
      } else {
        if (isReverse(td, s)) return [ first, [vq[0] + extend * s[0], 0], [0, vq[1] - extend * v[1]], last ];
      }
    } else {
      let first = [extend * sd[0], 0];
      let last = [0, extend * td[1]];
      if (isReverse(sd, s)) {
        if (isReverse(td, v)) return [ first, [0, vq[1] + extend * v[1]], [vq[0] + extend * s[0], 0], last ];
        else return [ first, [0, vq[1] - extend * v[1]], [vq[0] + extend * s[0], 0], last ];
      } else {
        if (isReverse(td, v)) return [ first, [0, vq[1] + extend * v[1]], [vq[0] - extend * s[0], 0], last ];
      }
    }
  }

  // 4个转折点
  // 条件：1、出发点方向和目标进入方向相同
  //       2、出发点方向与直接方向中垂直方向或水平方向平行且相反
  if (isEq(sd, td)) {
    if (isParallel(sd, v) && isReverse(sd, v)) {
      let first = [0, extend * sd[1]];
      let last = [0, extend * td[1]];
      let second = [vq[0] / 2, 0];
      return [ first, second, [0, vq[1] + 2 * extend * v[1]], second, last ];
    }
    else if (isParallel(sd, s) && isReverse(sd, s)) {
      let first = [extend * sd[0], 0];
      let last = [extend * td[0], 0];
      let second = [0, vq[1] / 2];
      return [ first, second, [vq[0] + 2 * extend * s[0], 0], second, last ];
    }
  }
  return [];
}
