import Image from 'next/image'
import {
  Code2,
  ExternalLink,
  Heart,
  History,
  Mail,
  MapPin,
  Music2,
  WalletCards,
} from 'lucide-react'
import Comments from '@/components/Comments'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { profile } from '@/data/profile'

const skillGroups = [
  { title: '语言', items: profile.skills.languages },
  { title: '前端', items: profile.skills.frontend },
  { title: '后端与自动化', items: profile.skills.backend },
  { title: '部署与数据', items: profile.skills.ops },
]

function SectionTitle({
  icon: Icon,
  title,
  eyebrow,
}: {
  icon: typeof Code2
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

function ProfileHero() {
  return (
    <section className="grid gap-8 pt-10 pb-12 md:grid-cols-[1fr_280px] md:items-end">
      <div className="max-w-3xl">
        <div className="mb-5 flex flex-wrap gap-2">
          {profile.interests.map((interest) => (
            <Badge key={interest} variant="outline" className="h-6 rounded-md">
              {interest}
            </Badge>
          ))}
        </div>
        <h1 className="text-4xl leading-tight font-semibold tracking-normal text-gray-950 sm:text-5xl dark:text-gray-50">
          {profile.name}
        </h1>
        <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">{profile.title}</p>
        <p className="mt-6 max-w-2xl text-base leading-8 text-gray-700 dark:text-gray-300">
          {profile.intro}
        </p>
        <blockquote className="mt-8 border-l border-gray-300 pl-4 text-sm leading-7 text-gray-500 dark:border-gray-700 dark:text-gray-400">
          {profile.quote}
        </blockquote>
        <div className="mt-8 flex flex-wrap gap-3">
          {profile.socialLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-9 items-center gap-2 rounded-md border border-gray-200 px-3 text-sm font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-200 dark:hover:border-gray-700 dark:hover:bg-gray-900"
            >
              <ExternalLink className="size-4" aria-hidden="true" />
              {link.label}
            </a>
          ))}
          <a
            href={`mailto:${profile.email}`}
            className="inline-flex h-9 items-center gap-2 rounded-md border border-gray-200 px-3 text-sm font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-200 dark:hover:border-gray-700 dark:hover:bg-gray-900"
          >
            <Mail className="size-4" aria-hidden="true" />
            Email
          </a>
        </div>
      </div>
      <div className="justify-self-start md:justify-self-end">
        <div className="relative size-36 overflow-hidden rounded-lg border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-gray-900">
          <Image
            src="/static/images/avatarImg.jpg"
            alt="Ruoduan avatar"
            fill
            className="object-cover"
          />
        </div>
        <p className="mt-4 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <MapPin className="size-4" aria-hidden="true" />
          {profile.location}
        </p>
      </div>
    </section>
  )
}

function SkillMatrix() {
  return (
    <section className="py-10">
      <SectionTitle icon={Code2} eyebrow="Stack" title="技术栈" />
      <div className="grid gap-px overflow-hidden rounded-lg border border-gray-200 bg-gray-200 md:grid-cols-2 dark:border-gray-800 dark:bg-gray-800">
        {skillGroups.map((group) => (
          <div key={group.title} className="bg-white p-5 dark:bg-gray-950">
            <h3 className="mb-4 text-sm font-semibold text-gray-950 dark:text-gray-50">
              {group.title}
            </h3>
            <div className="flex flex-wrap gap-2">
              {group.items.map((item) => (
                <Badge key={item} variant="secondary" className="h-6 rounded-md">
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function SiteHistory() {
  return (
    <section className="py-10">
      <SectionTitle icon={History} eyebrow="Timeline" title="关于本站" />
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <ol className="space-y-4 border-l border-gray-200 pl-5 dark:border-gray-800">
          {profile.siteHistory.map((item) => (
            <li key={item} className="relative text-sm leading-7 text-gray-700 dark:text-gray-300">
              <span className="absolute top-2 -left-[25px] size-2 rounded-full bg-gray-950 dark:bg-gray-50" />
              {item}
            </li>
          ))}
        </ol>
        <div className="space-y-3">
          {profile.siteStackNotes.map((note) => (
            <div
              key={note.title}
              className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950"
            >
              <h3 className="text-sm font-semibold text-gray-950 dark:text-gray-50">
                {note.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
                {note.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function MusicLibrary() {
  return (
    <section className="py-10">
      <SectionTitle icon={Music2} eyebrow="Music" title="一些小曲儿" />
      <div className="divide-y divide-gray-200 rounded-lg border border-gray-200 dark:divide-gray-800 dark:border-gray-800">
        {profile.music.map((track) => (
          <article
            key={track.src}
            className="grid gap-4 p-4 md:grid-cols-[1fr_320px] md:items-center"
          >
            <div>
              <h3 className="text-sm font-semibold text-gray-950 dark:text-gray-50">
                {track.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
                {track.description}
              </p>
            </div>
            {/* 这些是个人翻唱音频，没有独立字幕文件。 */}
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <audio controls preload="none" src={track.src} className="w-full" />
          </article>
        ))}
      </div>
    </section>
  )
}

function SupportPanel() {
  return (
    <section className="py-10">
      <SectionTitle icon={WalletCards} eyebrow="Support" title="赞赏" />
      <div className="grid gap-5 sm:grid-cols-2">
        {[
          { src: '/static/about/we_p.png', label: '微信' },
          { src: '/static/about/al_p.png', label: '支付宝' },
        ].map((item) => (
          <div
            key={item.src}
            className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950"
          >
            <div className="relative aspect-square overflow-hidden rounded-md bg-gray-50 dark:bg-gray-900">
              <Image
                src={item.src}
                alt={`${item.label}赞赏码`}
                fill
                className="object-contain p-3"
              />
            </div>
            <p className="mt-3 flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Heart className="size-4" aria-hidden="true" />
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

export function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <ProfileHero />
      <Separator />
      <SkillMatrix />
      <SiteHistory />
      <MusicLibrary />
      <SupportPanel />
      <section id="comment" className="py-10 text-center">
        <Comments slug="about" title="关于我" />
      </section>
    </div>
  )
}
