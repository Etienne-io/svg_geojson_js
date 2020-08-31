import { euratech, polytech, simple } from './svg_getter'

import { convertToGeojson } from './parser/svg_parser'

convertToGeojson(euratech, {latitude: 0.0, longitude: 0.0}, {latitude: 1.0, longitude: 1.0})