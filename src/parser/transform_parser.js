const { transform } = require("lodash");

import { identity, matrix as m, rotation, translate } from '../transforms/transforms_utils'

export const parseTransforms = (transformsString) => {
  if (!transformsString) return []

  var transforms = []

  var allTransformsString = transformsString.split(/(?<=\))/)
  allTransformsString.forEach( t => {
    if (t.includes('matrix')) {
      transforms.splice(0, 0, parseMatrixTransform(t))
    } 
    if (t.includes('translate')) {
      transforms.splice(0, 0, parseTranslateTransform(t))
    }
    if (t.includes('rotate')) {
      transforms.splice(0, 0, parseRotateTransform(t))
    }
  })
  return transforms
}

const parseMatrixTransform = (matrixTransform) => {
  const values = matrixTransform.trim().substring(7, matrixTransform.length -1).split(',')
  m = [[]];
  m[0][0] = parseFloat(values[0]);
  m[1][0] = parseFloat(values[1]);
  m[2][0] = 0;
  m[0][1] = parseFloat(values[2]);
  m[1][1] = parseFloat(values[3]);
  m[2][1] = 0;
  m[0][2] = parseFloat(values[4]);
  m[1][2] = parseFloat(values[5]);
  m[2][2] = 1;
  return matrix(m)
}

const parseTranslateTransform = (translateTransform) => {
  const values = translateTransform.trim().substring(10, translateTransform.length - 1).split(' ');
  const x = parseFloat(values[0])
  if (values[1]) {
    return translate(x, parseFloat(values[1]))
  }
  return translate(x)
}

const parseRotateTransform = (rotateTransform) => {
  const values = rotateTransform.trim().substring(7, rotateTransform.length - 1).split(' ');
  const angle = parseFloat(values[0])
  if (values[1] && values[2]) {
    return rotation(angle, {x: parseFloat(values[1]), y: parseFloat(values[2])})
  }
  return rotation(angle)
}