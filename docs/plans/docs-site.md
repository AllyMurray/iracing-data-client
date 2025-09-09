# iRacing Data Client Documentation Site Plan

## Architecture & Tech Stack
- **Framework**: Astro with Starlight theme for optimal docs experience
- **Content**: MDX for rich interactive documentation
- **Location**: `docs-site/` directory (separate from main package)
- **Styling**: Starlight's built-in theming with iRacing brand colors

## Site Structure
```
docs-site/
├── src/
│   ├── content/
│   │   └── docs/
│   │       ├── index.mdx              # Homepage
│   │       ├── getting-started/
│   │       │   ├── installation.mdx
│   │       │   ├── quickstart.mdx
│   │       │   └── authentication.mdx
│   │       ├── api-reference/
│   │       │   ├── car.mdx
│   │       │   ├── member.mdx
│   │       │   ├── track.mdx
│   │       │   └── [15 service files]
│   │       ├── guides/
│   │       │   ├── error-handling.mdx
│   │       │   ├── typescript-usage.mdx
│   │       │   └── advanced-usage.mdx
│   │       └── examples/
│   │           ├── basic-usage.mdx
│   │           ├── league-management.mdx
│   │           └── race-analysis.mdx
│   └── components/
│       ├── CodeExample.astro
│       └── ApiEndpoint.astro
├── astro.config.mjs
└── package.json
```

## Key Features
1. **Interactive Code Examples** - Live TypeScript examples with syntax highlighting
2. **API Reference** - Auto-generated from service definitions with search
3. **Responsive Design** - Mobile-friendly with Starlight's responsive layout
4. **Search Integration** - Full-text search across all documentation
5. **Dark/Light Mode** - Built-in theme switching

## Content Strategy
- **Getting Started**: Installation, authentication, first API call
- **API Reference**: Complete coverage of all 15 services with examples
- **Guides**: Error handling, TypeScript patterns, advanced configurations  
- **Examples**: Real-world use cases and integration patterns

## Development Workflow
- Hot reload during development
- Static site generation for fast loading
- Easy deployment to Netlify, Vercel, or GitHub Pages
- Integration with main repo's CI/CD pipeline

## Implementation Steps
1. Initialize Astro project with Starlight in `docs-site/` directory
2. Configure Astro with MDX and Starlight integrations
3. Set up navigation structure and site configuration
4. Create reusable components for code examples and API documentation
5. Write comprehensive documentation content for all sections
6. Configure build and deployment scripts
7. Integrate with main repository's development workflow

## Navigation Structure
```
- Home
- Getting Started
  - Installation
  - Quick Start
  - Authentication
- API Reference
  - Car Service
  - Member Service
  - Track Service
  - [All 15 services]
- Guides
  - Error Handling
  - TypeScript Usage
  - Advanced Configuration
- Examples
  - Basic Usage
  - League Management
  - Race Analysis
```

## Deployment Strategy
**GitHub Pages** with automated deployment via GitHub Actions:

- **Base URL**: `/iracing-data-client/` (repository name)
- **Source**: `gh-pages` branch built from `docs-site/` 
- **Workflow**: Automatic builds on push to main branch
- **Custom Domain**: Optional setup for cleaner URLs

### GitHub Actions Workflow
```yaml
name: Deploy Documentation
on:
  push:
    branches: [main]
    paths: ['docs-site/**']
  workflow_dispatch:

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'pnpm'
      - name: Install dependencies
        run: cd docs-site && pnpm install --frozen-lockfile
      - name: Build
        run: cd docs-site && pnpm run build
      - name: Deploy to GitHub Pages
        uses: actions/deploy-pages@v2
        with:
          path: docs-site/dist
```