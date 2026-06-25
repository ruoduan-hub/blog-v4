import Image from 'next/image'
import { Heart, WalletCards } from 'lucide-react'

function SectionTitle({
  icon: Icon,
  title,
  eyebrow,
}: {
  icon: typeof WalletCards
  title: string
  eyebrow: string
}) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <p className="mb-2 flex items-center gap-2 text-xs font-medium tracking-widest text-gray-500 uppercase dark:text-gray-400">
          <Icon className="size-3.5" aria-hidden="true" />
          {eyebrow}
        </p>
        <h2 className="text-2xl font-semibold tracking-normal text-gray-950 dark:text-gray-50">
          {title}
        </h2>
      </div>
    </div>
  )
}

export function SupportPanel() {
  return (
    <section className="py-10">
      <SectionTitle icon={WalletCards} eyebrow="Support" title="赞赏" />

      <p className="max-w-lg text-sm leading-7 text-gray-500 dark:text-gray-400">
        如果这些内容对你有所帮助，欢迎赞赏支持。
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {[
          { src: '/static/about/we_p.png', label: '微信赞赏' },
          { src: '/static/about/al_p.png', label: '支付宝赞赏' },
        ].map((item) => (
          <div
            key={item.src}
            className="group rounded-xl border border-gray-200/70 bg-white p-6 transition-all hover:border-gray-300 hover:shadow-sm dark:border-gray-800/70 dark:bg-gray-950 dark:hover:border-gray-700 dark:hover:shadow-gray-900"
          >
            <div className="mx-auto w-40">
              <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-50 p-1 ring-1 ring-gray-100 dark:bg-gray-900 dark:ring-gray-800">
                <Image
                  src={item.src}
                  alt={`${item.label}二维码`}
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-center gap-2">
              <Heart
                className="size-3.5 shrink-0 text-rose-400 dark:text-rose-500"
                aria-hidden="true"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {item.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
