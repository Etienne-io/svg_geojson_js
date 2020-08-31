import convert from 'xml-js'
import _ from 'lodash'
import { convertRect } from './rect_parser'

export const convertToGeojson = (svgString, southWest, northEast) => {

  var document = JSON.parse(convert.xml2json(svgString, {compact: false}))
  const georeference = getGeoreference(document, southWest, northEast)
  const svgNode = document.elements[0]
  
  var classes = {}
  var features = []
  var cursorPosition = null
  
  svgNode.elements.forEach( element => {
    switch (element.name) {
      case 'defs':
        classes = parseDefs(element)
        break
      case 'rect':
        features = features.concat(convertRect(cursorPosition, element, classes, georeference))
        break
      case 'polygon':

        break
      case 'polyline':

        break
      case 'line':

        break
      case 'circle':

        break
      case 'path':

        break
    }
    
  })
}

const parseRectElement = (element) => {

}

const getGeoreference = (json, southWest, northEast) => {
  const viewPort = getViewBox(json.elements[0].attributes)
  return { 
    topLeft: {
      x: viewPort.x, y: viewPort.y
    },
    bottomRight: {
      x: viewPort.width, y: viewPort.y
    },
    southWest: southWest,
    northEast: northEast
  }
}

const getImageSize = (json) => {
  const attrs = json.elements[0].attributes
  const viewBox = getViewBox(attrs)
}

const getViewBox = (attrs) => {
  const viewBoxString = attrs.viewBox
  const [x, y, width, height] = viewBoxString.split(" ").map( e => parseFloat(e))
  return {x: x, y: y, width: width, height: height}
}

const parseDefs = (defs) => {
  var classes = {}
  parseGradient(defs, classes)
  parseStyle(defs, classes)
  return classes
}

const parseStyle = (defs, container) => {
  var styleString;
  defs.elements.forEach( element => {
    if (element.name === 'style') {
      styleString = element.elements[0].text
    }
  })
  if (!styleString || styleString.length === 0) return

  const splittedStyleString = styleString.split(/(?<=})/)
  splittedStyleString.forEach( s => {
    var splittedClassesString = s.split(/(?=\{)/)
    var style = {}
    var classNames = []
    splittedClassesString.forEach( s1 => {
      if (s1.includes('{')) {
        var keyValues = s1.substring(1, s1.length -1).split(";")
        keyValues.forEach( keyValue => {
          var keyValueArray = keyValue.split(":")
          switch (keyValueArray[0]) {
            case "fill":
              if (keyValueArray[1].includes("url")) {
                const className = keyValueArray[1].replace("url(#", "").replace(")", "")
                style.fillColor = container[className].fillColor
              } else {
                style.fillColor = keyValueArray[1]
              }
              break;
            case "stroke":
              if (keyValueArray[1].includes("url")) {
                const className = keyValueArray[1].replace("url(#", "").replace(")", "")
                style.strokeColor = container[className].strokeColor
              } else {
                style.strokeColor = keyValueArray[1]
              }
              break;
            case "stroke-width":
              if (keyValueArray[1].includes("url")) {
                  const className = keyValueArray[1].replace("url(#", "").replace("px)", "");
                  style.strokeWidth = container[className].strokeWidth
              } else {
                  const value = keyValueArray[1];
                  const width = value.substring(0, value.length - 2);
                  style.strokeWidth = parseFloat(width);
              }
              break;
            case "stroke-linecap":
              if (keyValueArray[1].includes("url")) {
                  const className = keyValueArray[1].replace("url(#", "").replace(")", "");
                  style.strokeLineCap = container[className].strokeLineCap
              } else {
                  style.strokeLineCap = keyValueArray[1]
              }
              break;
            case "stroke-linejoin":
              if (keyValueArray[1].includes("url")) {
                const className = keyValueArray[1].replace("url(#", "").replace(")", "");
                style.strokeLineJoin = container[className].strokeLineJoin
              } else {
                style.strokeLineJoin = keyValueArray[1]
              }
              break;
            case "stroke-opacity":
              if (keyValueArray[1].includes("url")) {
                  var className = keyValueArray[1].replace("url(#", "").replace(")", "");
                  style.strokeOpacity = container[className].strokeOpacity
              } else {
                style.strokeOpacity = parseFloat(keyValueArray[1]);
              }
              break;
          }
        })
      }
      else {
        var cs = s1.trim().split(",")
        cs.forEach( c => {
          if (c) {
            classNames.push(c.replace(".", ""))
          }
        })
      }
    })
    classNames.forEach( className => {
      if (container[className]) {
        container[className] = _.merge(container[className], style)
      }
      else {
        container[className] = style
      }
    })
  })
}

const parseGradient = (defs, container) => {
  defs.elements.forEach( element => {
    if (element.name === 'linearGradient') {
      const id = element.attributes.id
      const href = element.attributes["xlink:href"]
      if (href) {
        container[id] = container[href.replace("#", "")]
      }
      else {
        var style = {}
        element.elements.forEach( stop => {
          style.fillColor = stop.attributes['stop-color']
        })
        container[id] = style
      }
    }
  })
}
