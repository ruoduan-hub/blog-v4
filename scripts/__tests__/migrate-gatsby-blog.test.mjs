import assert from 'node:assert/strict'
import test from 'node:test'
import { normalizeFrontmatter, rewriteAssetRefs, toMdxSafeBody } from '../migrate-gatsby-blog.mjs'

test('normalizeFrontmatter keeps title and date and normalizes tags', () => {
  const result = normalizeFrontmatter({
    title: 'React-mode[进阶] React模式梳理',
    date: '2020-04-07',
    tags: 'React',
    categories: 'React',
  })

  assert.equal(result.title, 'React-mode[进阶] React模式梳理')
  assert.equal(result.date, '2020-04-07')
  assert.deepEqual(result.tags, ['React'])
  assert.deepEqual(result.categories, ['React'])
  assert.deepEqual(result.authors, ['default'])
  assert.equal(result.draft, false)
})

test('toMdxSafeBody converts common raw HTML into MDX-safe syntax', () => {
  const input =
    '<br>\\n<iframe frameborder="no" marginwidth="0" marginheight="0" src="//music.163.com/outchain/player?id=1"></iframe>'

  const result = toMdxSafeBody(input)

  assert.match(result, /<br \/>/)
  assert.match(result, /frameBorder="no"/)
  assert.match(result, /src="https:\/\/music\.163\.com/)
  assert.doesNotMatch(result, /marginwidth=/)
  assert.doesNotMatch(result, /marginheight=/)
})

test('rewriteAssetRefs rewrites local assets to public static blog paths', () => {
  const { body, assets } = rewriteAssetRefs(
    '![flow](./reactHook-Typescript从入门到实践/ReactHook redex.png)',
    'reactHook-Typescript从入门到实践'
  )

  assert.equal(body, '![flow](/static/blog/reactHook-Typescript从入门到实践/ReactHook redex.png)')
  assert.deepEqual(assets, ['reactHook-Typescript从入门到实践/ReactHook redex.png'])
})
