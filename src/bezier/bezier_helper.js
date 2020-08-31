export const quadraticBezierCurve = (p1, cp1, p2) => {
  var points = []
  for (var t = 0; t <= 10; t += 1) {
    const T = t / 10
    const x = (1 - T) * (1 - T) * p1.x + 2 * (1 - T) * T * p2.x + T * T * cp1.x
    const y = (1 - T) * (1 - T) * p1.y + 2 * (1 - T) * T * p2.y + T * T * cp1.y
    points.push({ x: x, y: y })
  }
  return points
}

export const cubicBezierCurve = (p1, cp1, cp2, p2) => {
  var points = []
  for (var T = 0; T <= 10; T += 1) {
    const t = T / 10
    const x = p1.x * Math.pow(1 - t, 3)
      + 3 * cp1.x * t * Math.pow(1 - t, 2)
      + 3 * cp2.x * Math.pow(t, 2) * (1 - t)
      + p2.x * Math.pow(t, 3)
    const y = p1.y * Math.pow(1 - t, 3)
      + 3 * cp1.y * t * Math.pow(1 - t, 2)
      + 3 * cp2.y * Math.pow(t, 2) * (1 - t)
      + p2.y * Math.pow(t, 3)
    points.push(new Point(x, y))
  }
  return points
}