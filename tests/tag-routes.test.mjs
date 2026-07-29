import assert from 'node:assert/strict'
import test from 'node:test'

import { normalizeTagParam, tagToRouteParam } from '../lib/content/tag-routes.mjs'

test('normalizeTagParam returns the business slug for Chinese tag route params', () => {
  assert.equal(normalizeTagParam('记'), '记')
  assert.equal(normalizeTagParam('%E8%AE%B0'), '记')
  assert.equal(normalizeTagParam('%25E8%25AE%25B0'), '记')
})

test('tagToRouteParam leaves dynamic segment values unencoded for Next static params', () => {
  assert.equal(tagToRouteParam('记'), '记')
  assert.equal(tagToRouteParam('前端'), '前端')
  assert.equal(tagToRouteParam('front-end'), 'front-end')
})
