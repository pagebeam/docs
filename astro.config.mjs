import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightLlmsTxt from 'starlight-llms-txt';

const SITE = 'https://docs.pagebeam.dev';
const DESCRIPTION =
  'pagebeam checks every page of your documentation against the application it describes, says how sure it is, and opens the pull request that fixes what it can.';

export default defineConfig({
  site: SITE,
  integrations: [
    starlight({
      title: 'pagebeam docs',
      description: DESCRIPTION,
      logo: {
        light: './src/assets/brand/lockup-light.svg',
        dark: './src/assets/brand/lockup-dark.svg',
        replacesTitle: true,
        alt: 'pagebeam',
      },
      favicon: '/brand/favicon.svg',
      customCss: ['./src/styles/theme.css'],
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/pagebeam/pagebeam' },
        { icon: 'npm', label: 'npm', href: 'https://www.npmjs.com/package/pagebeam' },
      ],
      editLink: { baseUrl: 'https://github.com/pagebeam/docs/edit/main/' },
      lastUpdated: true,
      head: [
        { tag: 'link', attrs: { rel: 'icon', href: '/favicon.ico', sizes: '32x32' } },
        { tag: 'link', attrs: { rel: 'apple-touch-icon', href: '/brand/apple-touch-icon.png' } },
        { tag: 'link', attrs: { rel: 'manifest', href: '/brand/site.webmanifest' } },
        { tag: 'meta', attrs: { property: 'og:image', content: `${SITE}/brand/og.png` } },
        { tag: 'meta', attrs: { property: 'og:image:width', content: '1200' } },
        { tag: 'meta', attrs: { property: 'og:image:height', content: '630' } },
        { tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' } },
        { tag: 'meta', attrs: { name: 'twitter:image', content: `${SITE}/brand/og.png` } },
      ],
      // The order matters: theme.css gives each top-level group its area colour by position.
      sidebar: [
        { label: 'Get started', items: [{ label: 'Introduction', link: '/' }, 'getting-started'] },
        { label: 'Checks', items: ['checks', 'checks/standing', 'checks/coverage'] },
        { label: 'Configuration', items: ['configuration'] },
        { label: 'Proposals', items: ['proposals'] },
        { label: 'CLI reference', items: ['cli'] },
      ],
      plugins: [
        starlightLlmsTxt({
          projectName: 'pagebeam',
          description: DESCRIPTION,
          details:
            'pagebeam is a command line tool, run with `npx pagebeam`. Findings are either proven (the source of truth says so) or review (worth a look, not proof). Only proven findings can fail a build, and only under an enforcing profile.',
          optionalLinks: [{ label: 'pagebeam source on GitHub', url: 'https://github.com/pagebeam/pagebeam' }],
        }),
      ],
    }),
  ],
});
