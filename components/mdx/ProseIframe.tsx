import type { ComponentPropsWithoutRef } from 'react'

type ProseIframeProps = ComponentPropsWithoutRef<'iframe'>

/**
 * 旧文章里有网易云音乐外链播放器，统一包一层保证移动端不会溢出。
 */
export function ProseIframe({ className, title, ...props }: ProseIframeProps) {
  return (
    <span className="my-8 block w-full overflow-hidden rounded-md border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
      <iframe
        {...props}
        title={title || '嵌入内容'}
        loading={props.loading || 'lazy'}
        className={['block max-w-full', className].filter(Boolean).join(' ')}
      />
    </span>
  )
}
