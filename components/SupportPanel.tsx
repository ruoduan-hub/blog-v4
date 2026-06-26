'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Heart } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog'

const QR_ITEMS = [
  { key: 'wechat' as const, src: '/static/about/we_p.png', label: '微信赞赏' },
  { key: 'alipay' as const, src: '/static/about/al_p.png', label: '支付宝赞赏' },
]

export function SupportPanel() {
  const [activeTab, setActiveTab] = useState<'wechat' | 'alipay'>('wechat')

  return (
    <section className="py-10">
      <div className="mb-8">
        <p className="mb-2 flex items-center gap-2 text-xs font-medium tracking-widest text-gray-500 uppercase dark:text-gray-400">
          <Heart className="size-3.5" aria-hidden="true" />
          Support
        </p>
        <h2 className="text-2xl font-semibold tracking-normal text-gray-950 dark:text-gray-50">
          赞赏
        </h2>
        <p className="mt-2 max-w-lg text-sm leading-7 text-gray-500 dark:text-gray-400">
          如果这些内容对你有所帮助，欢迎赞赏支持。
        </p>
      </div>

      <Dialog>
        <DialogTrigger className="group relative isolate inline-flex cursor-pointer items-center gap-3 overflow-hidden rounded-2xl border border-gray-200/60 bg-white px-6 py-4 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-lg hover:shadow-gray-200/50 dark:border-gray-800 dark:bg-gray-900/50 dark:hover:border-gray-700 dark:hover:shadow-gray-950/50">
          {/*
           * Decorative gradient blob on hover — warm tones, very subtle.
           * Only visible on hover, adds a gentle "glow" behind the icon.
           */}
          <span
            className="absolute inset-0 -z-10 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
            aria-hidden="true"
          >
            <span className="absolute -top-6 -left-6 size-20 rounded-full bg-amber-400/20 blur-2xl dark:bg-orange-500/15" />
            <span className="absolute -right-6 -bottom-6 size-24 rounded-full bg-rose-300/20 blur-2xl dark:bg-rose-500/10" />
          </span>

          {/*
           * Icon slot — a warm gradient circle containing the coffee emoji.
           */}
          <span className="relative flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 ring-1 ring-amber-200/60 dark:from-amber-900/30 dark:to-orange-900/20 dark:ring-amber-700/30">
            <span className="text-xl leading-none select-none">{'\u2615'}</span>
          </span>

          <span className="flex flex-col items-start">
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              请作者喝杯咖啡
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">如果觉得内容有用</span>
          </span>

          {/*
           * Arrow indicator — subtle, appears on hover.
           */}
          <span className="ml-auto hidden text-gray-300 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-gray-400 sm:inline-block dark:text-gray-600 dark:group-hover:text-gray-500">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M6 4L10 8L6 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </DialogTrigger>

        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-lg">感谢你的支持</DialogTitle>
            <DialogDescription className="text-center">
              每一份赞赏都是对创作的最大鼓励
            </DialogDescription>
          </DialogHeader>

          {/*
           * Tab switcher — segmented control style, clean and obvious.
           */}
          <div className="mx-auto flex w-full max-w-[280px] rounded-xl bg-gray-100 p-1 dark:bg-gray-800">
            {QR_ITEMS.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setActiveTab(item.key)}
                className={`flex-1 cursor-pointer rounded-lg py-2 text-sm font-medium transition-all duration-200 ${
                  activeTab === item.key
                    ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-gray-100'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/*
           * QR code — always on a clean white surface for scannability.
           * Size is generous but capped, so it scales well on all devices.
           */}
          {QR_ITEMS.map(
            (item) =>
              activeTab === item.key && (
                <div key={item.key} className="mt-2">
                  <div className="relative mx-auto aspect-square w-full max-w-[240px] overflow-hidden rounded-2xl bg-white p-4 ring-1 ring-gray-200/80">
                    <Image
                      src={item.src}
                      alt={`${item.label}二维码`}
                      fill
                      className="object-contain"
                      sizes="240px"
                    />
                  </div>
                  <p className="mt-3 text-center text-xs text-gray-400 dark:text-gray-500">
                    打开{item.label}扫一扫
                  </p>
                </div>
              )
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}
