import { parseTransforms } from './transform_parser'
import { quadraticBezierCurve } from '../bezier/bezier_helper'

export const convertRect = (cursorPosition, element, classes, georeference) => {

  var x, y, rx, ry, width, height, style, transforms
  x = parseFloat(element.attributes.x)
  y = parseFloat(element.attributes.y)
  rx = -1
  ry = -1
  if (element.attributes.rx) {
    rx = parseFloat(element.attributes.rx)
  }
  if (element.attributes.ry) {
    ry = parseFloat(element.attributes.ry)
  }
  width = parseFloat(element.attributes.width)
  height = parseFloat(element.attributes.height)
  style = classes[element.attributes.class]
  transforms = parseTransforms(element.attributes.transform)

  var points = extractPoints(x, y, rx, ry, width, height)
  transforms.forEach(t => points = points.map(t))
  

}

const extractPoints = (x, y, rx, ry, width, height) => {
  var points = []
  if (rx < 0.0 && ry > 0.0) rx = ry;
  if (ry < 0.0 && rx > 0.0) ry = rx;
  if (rx < 0.0) rx = 0.0;
  if (ry < 0.0) ry = 0.0;
  if (rx > width / 2.0) rx = width / 2.0;
  if (ry > height / 2.0) ry = height / 2.0;
  if (rx < 0.00001 || ry < 0.0001) {
    points.push({ x: x, y: y });
    points.push({ x: x + width, y: y });
    points.push({ x: x + width, y: y + height });
    points.push({x: x, y: y + height});
    points.push({ x: x, y: y });
  } else {
    points.push({x: x + rx, y: y});
    points.push({x: x + width - rx, y: y});
    points = points.concat(quadraticBezierCurve(points[points.length - 1], {x: x + width, y: y + ry}, {x: x + width, y: y}));
    points.push({x: x + width, y: y + height - ry});
    points = points.concat(quadraticBezierCurve(points[points.length - 1], {x: x + width - rx, y: y + height}, {x: x + width, y: y + height}));
    points.push({x: x + rx, y: y + height});
    points = points.concat(quadraticBezierCurve(points[points.length - 1], {x: x, y: y + height - ry}, {x: x, y: y + height}));
    points.push({x: x, y: y + ry});
    points = points.concat(quadraticBezierCurve(points[points.length - 1], {x: x + rx, y: y}, {x: x, y: y}));
  }

  return points
}