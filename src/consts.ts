import type { IconMap, SocialLink, Site } from '@/types'

export const SITE: Site = {
  title: 'z8dn',
  description:
    'Personal blog and portfolio of Zayden (z8dn) — thoughts, projects, and creative explorations.',
  href: 'https://z8dn.github.io',
  author: 'z8dn',
  locale: 'en-US',
  featuredPostCount: 2,
  postsPerPage: 3,
}

export const NAV_LINKS: SocialLink[] = [
  {
    href: '/blog',
    label: 'blog',
  },
  {
    href: '/authors',
    label: 'authors',
  },
  {
    href: '/about',
    label: 'about',
  },
]

export const SOCIAL_LINKS: SocialLink[] = [
  {
    href: 'https://github.com/z8dn',
    label: 'GitHub',
  },
  {
    href: 'https://twitter.com/z8dn',
    label: 'Twitter',
  },
  {
    href: 'mailto:phunggiabuu30@gmail.com',
    label: 'Email',
  },
  {
    href: '/rss.xml',
    label: 'RSS',
  },
]

export const ICON_MAP: IconMap = {
  Website: 'lucide:globe',
  GitHub: 'lucide:github',
  LinkedIn: 'lucide:linkedin',
  Twitter: 'lucide:twitter',
  Email: 'lucide:mail',
  RSS: 'lucide:rss',
}
