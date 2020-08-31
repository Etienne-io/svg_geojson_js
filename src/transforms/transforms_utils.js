export const identity = () => function (point) {
  return {
    x: point.x,
    y: point.y
  }
}

export const matrix = (matrix) => function (point) {
  return {
    x: matrix[0][0] * point.x + matrix[0][1] * point.y + matrix[0][2],
    y: matrix[1][0] * point.x + matrix[1][1] * point.y + matrix[1][2]
  }
}

export const rotation = (teta, center = { x: 0, y: 0 }) => function (point) {
  const tetaRadian = teta * Math.PI / 180;
  const s = Math.sin(tetaRadian);
  const c = Math.cos(tetaRadian);
  const px = point.x - center.x;
  const py = point.y - center.y;
  const x = px * c - py * s;
  const y = px * s + py * c;

  return {
    x: center.x + x,
    y: center.y + y
  }
}

export const translate = (x, y = 0) => function (point) {
  return {
    x: point.x + x,
    y: point.y + y
  }
}