const D2R = Math.PI / 180
const R2D = 180 / Math.PI
const A = 6378137.0
const MAXEXTENT = 20037508.342789244

const getPerpendicular = (vector) => {
  return { x: vector.y, y: -vector.x }
}

const scalarProduct = (p1, p2) => {
  return (p1.x * p2.x) + (p1.y * p2.y)
}

const add = (p1, p2) => {
  return { x: p1.x + p2.x, y: p1.y + p2.y }
}

const subtract = (p1, p2) => {
  return { x: p1.x - p2.x, y: p1.y - p2.y }
}

const length = (p) => {
  return Math.hypot(p.x, p.y)
}

const multiplyBy = (point, scalar) => {
  return { x: point.x * scalar, y: point.y * scalar }
}

const project = (point, georeference) => {
  let point0 = point
  let point1 = georeference.bottomLeft
  let point2 = georeference.topRight
  let latLng1 = georeference.southWest
  let latLng2 = georeference.northEast
  let point12 = subtract(point2, point1)
  let point10 = subtract(point0, point1)
  let point12Perpendicular = getPerpendicular(point12)

  let projectParallel = scalarProduct(point12, point10) / (length(point12) * length(point12))
  let projectPerpendicular = scalarProduct(point12Perpendicular, point10) / (length(point12Perpendicular) * length(point12Perpendicular))

  let pxLatLng1 = forward(latLng1)
  let pxLatLng2 = forward(latLng2)
  let pxLatLng0 = add(add(pxLatLng1, multiplyBy(subtract(pxLatLng2, pxLatLng1), projectParallel)), multiplyBy(getPerpendicular(subtract(pxLatLng2, pxLatLng1)), projectPerpendicular))
  return inverse(pxLatLng0)
}

/**
 * Convert a LatLng into a Point in Cartesian coordinate
 *
 * @param latLng to convert
 * @return the converted Point
 */
const forward = (latLng) => {
  var x = A * latLng.longitude * D2R
  var y = A * Math.log(Math.tan((Math.PI * 0.25) + (0.5 * latLng.latitude * D2R)))

  if (x > MAXEXTENT) x = MAXEXTENT
  if (x < -MAXEXTENT) y = -MAXEXTENT
  if (y > MAXEXTENT) y = MAXEXTENT
  if (y < -MAXEXTENT) y = -MAXEXTENT

  return { x: x, y: y }
}

/**
 * Convert a Point in Cartesian coordinate to LatLng
 *
 * @param point to convert
 * @return the converted LatLng
 */
function inverse(point) {
  let longitude = point.x * R2D / A
  let latitude = ((Math.PI * 0.5) - 2.0 * Math.atan(Math.exp(-point.y / A))) * R2D
  return { latitude: latitude, longitude: longitude }
}

export { project }