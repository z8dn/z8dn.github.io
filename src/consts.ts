import type { IconMap, SocialLink, Site } from '@/types'

export const SITE: Site = {
  title: 'z8dn',
  description:
    'Zayden (z8dn) — Android engineer in Ho Chi Minh City. Apps, build tooling and writing.',
  href: 'https://z8dn.github.io',
  author: 'z8dn',
  locale: 'en-US',
  featuredPostCount: 2,
  postsPerPage: 3,
}

export const NAV_LINKS: SocialLink[] = [
  {
    href: '/work',
    label: 'work',
  },
  {
    href: '/blog',
    label: 'blog',
  },
]

export const SOCIAL_LINKS: SocialLink[] = [
  {
    href: 'https://github.com/z8dn',
    label: 'GitHub',
  },
  {
    href: 'https://linkedin.com/in/z8dn',
    label: 'LinkedIn',
  },
  {
    href: 'https://medium.com/@z8dn',
    label: 'Medium',
  },
  {
    href: 'mailto:z8dn.phung@gmail.com',
    label: 'Email',
  },
  {
    href: '/rss.xml',
    label: 'RSS',
  },
]

export const ICON_MAP: IconMap = {
  Website: 'lucide:globe',
  GitHub: 'simple-icons:github',
  LinkedIn: 'simple-icons:linkedin',
  Medium: 'simple-icons:medium',
  Email: 'lucide:mail',
  RSS: 'lucide:rss',
}
