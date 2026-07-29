import { slug } from 'github-slugger'

function decodePathSegment(value) {
  let decodedValue = value

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const nextValue = decodeURIComponent(decodedValue)
      if (nextValue === decodedValue) break
      decodedValue = nextValue
    } catch {
      break
    }
  }

  return decodedValue
}

export function normalizeTagParam(param = '') {
  return slug(decodePathSegment(param))
}

export function tagToRouteParam(tag) {
  return tag
}
