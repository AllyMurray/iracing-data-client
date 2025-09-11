// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'iRacing Data Client',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/ally/iracing-data-client' }],
			sidebar: [
				{
					label: 'Getting Started',
					items: [
						{ label: 'Introduction', slug: 'getting-started/introduction' },
						{ label: 'Installation', slug: 'getting-started/installation' },
						{ label: 'Quick Start', slug: 'getting-started/quick-start' },
						{ label: 'Authentication', slug: 'getting-started/authentication' },
					],
				},
				{
					label: 'Guides',
					items: [
						{ label: 'Error Handling', slug: 'guides/error-handling' },
						{ label: 'TypeScript Usage', slug: 'guides/typescript' },
						{ label: 'Caching', slug: 'guides/caching' },
						{ label: 'Rate Limiting', slug: 'guides/rate-limiting' },
					],
				},
				{
					label: 'API Reference',
					items: [
						{ label: 'Client', slug: 'api/client' },
						{ label: 'Services Overview', slug: 'api/services' },
						{
							label: 'Services',
							items: [
								{ label: 'Car', slug: 'api/services/car' },
								{ label: 'Car Class', slug: 'api/services/carclass' },
								{ label: 'Constants', slug: 'api/services/constants' },
								{ label: 'Driver Stats', slug: 'api/services/driver-stats' },
								{ label: 'Hosted', slug: 'api/services/hosted' },
								{ label: 'League', slug: 'api/services/league' },
								{ label: 'Lookup', slug: 'api/services/lookup' },
								{ label: 'Member', slug: 'api/services/member' },
								{ label: 'Results', slug: 'api/services/results' },
								{ label: 'Season', slug: 'api/services/season' },
								{ label: 'Series', slug: 'api/services/series' },
								{ label: 'Stats', slug: 'api/services/stats' },
								{ label: 'Team', slug: 'api/services/team' },
								{ label: 'Time Attack', slug: 'api/services/time-attack' },
								{ label: 'Track', slug: 'api/services/track' },
							],
						},
					],
				},
				{
					label: 'Examples',
					items: [
						{ label: 'Fetching Member Data', slug: 'examples/member-data' },
						{ label: 'Race Results', slug: 'examples/race-results' },
						{ label: 'Season Standings', slug: 'examples/season-standings' },
						{ label: 'Track Information', slug: 'examples/track-info' },
					],
				},
			],
		}),
	],
});
