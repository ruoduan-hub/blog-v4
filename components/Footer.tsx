import siteMetadata from '@/data/siteMetadata'
import SocialIcon from '@/components/social-icons'

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-200 dark:border-gray-800">
      <div className="flex flex-col items-center gap-4 py-8">
        {/* Social icons */}
        <div className="flex items-center gap-5">
          <SocialIcon kind="mail" href={`mailto:${siteMetadata.email}`} size={5} />
          <SocialIcon kind="github" href={siteMetadata.github} size={5} />
          <SocialIcon kind="rss" href={`${siteMetadata.siteUrl}/feed.xml`} size={5} />
        </div>

        {/* Copyright */}
        <div className="text-center text-sm leading-relaxed text-gray-500 dark:text-gray-400">
          <span>{`© ${new Date().getFullYear()} `}</span>
          <span>{siteMetadata.author}</span>
        </div>

        {/* ICP + CC license */}
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-center text-xs text-gray-400 dark:text-gray-500">
          <a
            href="https://beian.miit.gov.cn"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-gray-600 dark:hover:text-gray-300"
          >
            滇ICP备19003866号
          </a>
          <span className="text-gray-300 dark:text-gray-600">|</span>
          <a
            href="https://creativecommons.org/licenses/by-sa/4.0/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-gray-600 dark:hover:text-gray-300"
          >
            CC BY-SA 4.0
          </a>
        </div>
      </div>
    </footer>
  )
}
