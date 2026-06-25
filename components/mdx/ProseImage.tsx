import type { ComponentPropsWithoutRef, CSSProperties } from 'react'

type ProseImageProps = ComponentPropsWithoutRef<'img'> & {
  'data-zoom'?: string
}

function getZoomWidth(zoom?: string) {
  if (!zoom) return undefined

  const value = Number.parseFloat(zoom)
  if (!Number.isFinite(value) || value <= 0 || value >= 100) return undefined

  return `${value}%`
}

/**
 * 旧博客文章中保留了部分原生 img 标签。这里使用普通 img，避免远程图片缺少尺寸时触发 Next Image 限制。
 */
export function ProseImage({ alt = '', className, style, ...props }: ProseImageProps) {
  const widthFromZoom = getZoomWidth(props['data-zoom'])
  const imageStyle: CSSProperties = {
    ...style,
    width: widthFromZoom || style?.width,
    maxWidth: '100%',
    height: 'auto',
  }

  return (
    // 旧文章包含大量无尺寸远程图片，使用原生 img 保持迁移后的内容可直接渲染。
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...props}
      alt={alt}
      loading={props.loading || 'lazy'}
      decoding={props.decoding || 'async'}
      className={[
        'my-8 rounded-md border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={imageStyle}
    />
  )
}
