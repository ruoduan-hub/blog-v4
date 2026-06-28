import Link from '@/components/Link'
import { slug } from 'github-slugger'
import tagData from 'app/tag-data.json'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: '标签', description: '文章主题标签' })

const themePrinciples = [
  {
    title: '阅读先行',
    description: '正文、列表和标签计数继续交给低 chroma 灰阶承载，避免主色抢走长文阅读的注意力。',
  },
  {
    title: '实验室气质',
    description:
      'Mineral Teal 只出现在链接、焦点、进度条和关键状态上，像仪器指示灯一样建立站点记忆点。',
  },
  {
    title: '深色稳定',
    description:
      '深色模式使用接近墨绿的灰阶做底，主色降到 400/300 色阶，保证 hover 和代码片段清楚但不刺眼。',
  },
]

const colorScale = [
  { label: 'Primary 500', className: 'bg-primary-500', text: '核心链接与进度' },
  { label: 'Primary 100', className: 'bg-primary-100', text: '标签背景与轻提示' },
  { label: 'Gray 950', className: 'bg-gray-950', text: '深色背景基底' },
  { label: 'Gray 200', className: 'bg-gray-200', text: '分隔线与边界' },
]

export default async function Page() {
  const tagCounts = tagData as Record<string, number>
  const tagKeys = Object.keys(tagCounts)
  const sortedTags = tagKeys.sort((a, b) => tagCounts[b] - tagCounts[a])
  const totalTaggedPosts = sortedTags.reduce((total, tag) => total + tagCounts[tag], 0)
  const topTags = sortedTags.slice(0, 4)

  return (
    <div className="min-w-0 overflow-x-hidden py-10 sm:py-14">
      <section className="border-b border-gray-200 pb-10 dark:border-gray-800">
        <div className="grid min-w-0 gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div className="min-w-0">
            <p className="text-primary-600 dark:text-primary-400 text-sm font-medium">
              文章主题索引
            </p>
            <h1 className="mt-3 text-4xl leading-tight font-semibold tracking-normal text-gray-950 sm:text-5xl dark:text-gray-50">
              标签
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-gray-600 dark:text-gray-300">
              用标签把工程化、前端、部署、算法和个人折腾记录串起来。新的主题色会服务于导航与识别，不打断阅读。
            </p>
          </div>

          <dl className="grid min-w-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-200 text-center sm:grid-cols-2 dark:border-gray-800 dark:bg-gray-800">
            <div className="bg-white p-5 dark:bg-gray-950">
              <dt className="text-sm text-gray-500 dark:text-gray-400">标签数</dt>
              <dd className="mt-2 text-3xl font-semibold text-gray-950 dark:text-gray-50">
                {sortedTags.length}
              </dd>
            </div>
            <div className="bg-white p-5 dark:bg-gray-950">
              <dt className="text-sm text-gray-500 dark:text-gray-400">引用次数</dt>
              <dd className="mt-2 text-3xl font-semibold text-gray-950 dark:text-gray-50">
                {totalTaggedPosts}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="min-w-0 py-10">
        <div className="flex min-w-0 flex-wrap gap-x-3 gap-y-3 sm:gap-x-5">
          {tagKeys.length === 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400">还没有标签。</p>
          )}
          {sortedTags.map((t) => (
            <Link
              key={t}
              href={`/tags/${slug(t)}`}
              className="hover:bg-primary-50 hover:text-primary-700 hover:ring-primary-100 dark:hover:bg-primary-950 dark:hover:text-primary-300 dark:hover:ring-primary-800 text-primary-600 dark:text-primary-400 inline-flex max-w-full items-baseline gap-1 rounded-full bg-gray-50 px-3 py-2 text-sm font-medium uppercase ring-1 ring-gray-200 transition-colors dark:bg-gray-900 dark:ring-gray-800"
              aria-label={`查看 ${t} 标签下的文章`}
            >
              <span className="min-w-0 break-words">{t.split(' ').join('-')}</span>
              <span className="font-semibold text-gray-500 dark:text-gray-400">
                {`(${tagCounts[t]})`}
              </span>
            </Link>
          ))}
        </div>

        {topTags.length > 0 && (
          <div className="mt-8 flex min-w-0 flex-wrap gap-2 border-t border-gray-200 pt-6 dark:border-gray-800">
            <span className="mr-2 text-sm text-gray-500 dark:text-gray-400">高频主题</span>
            {topTags.map((tag) => (
              <Link
                key={tag}
                href={`/tags/${slug(tag)}`}
                className="bg-primary-50 text-primary-700 ring-primary-100 hover:bg-primary-100 dark:bg-primary-950 dark:text-primary-300 dark:ring-primary-800 dark:hover:bg-primary-900 rounded-full px-3 py-1 text-sm font-medium ring-1 transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="border-t border-gray-200 py-10 dark:border-gray-800">
        <div className="grid min-w-0 gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="min-w-0">
            <p className="text-primary-600 dark:text-primary-400 text-sm font-medium">
              Mineral Teal
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-normal text-gray-950 dark:text-gray-50">
              主题色设计理念
            </h2>
            <p className="mt-4 text-sm leading-7 text-gray-600 dark:text-gray-300">
              这套颜色把原来的玫红暖调换成低饱和矿物绿。它更像一间安静的个人技术实验室：工具可靠、信息清楚，同时在链接和状态上保留可识别的个人气质。
            </p>
          </div>

          <div className="min-w-0 space-y-6">
            <div className="grid gap-3 sm:grid-cols-2">
              {themePrinciples.map((principle) => (
                <article
                  key={principle.title}
                  className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-950"
                >
                  <h3 className="text-sm font-semibold text-gray-950 dark:text-gray-50">
                    {principle.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-gray-600 dark:text-gray-400">
                    {principle.description}
                  </p>
                </article>
              ))}
            </div>

            <div className="rounded-lg border border-gray-200 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-900">
              <div className="grid gap-4 sm:grid-cols-4">
                {colorScale.map((item) => (
                  <div key={item.label}>
                    <div
                      className={`h-14 rounded-md ring-1 ring-gray-950/10 dark:ring-white/10 ${item.className}`}
                    />
                    <p className="mt-3 text-sm font-semibold text-gray-950 dark:text-gray-50">
                      {item.label}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
