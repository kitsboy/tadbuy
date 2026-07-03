# Contributing to Tadbuy

Thank you for helping build the world's first Bitcoin-native advertising platform.

## Development Setup

```bash
git clone https://github.com/kitsboy/tadbuy.git
cd tadbuy
npm install
cp .env.example .env.local
npm run dev
```

Open http://127.0.0.1:5173 and edit files in `src/`. Changes hot-reload automatically.

## Before You Commit

1. Run `npm run lint` — must pass with zero errors
2. Run `npm run build` — must complete successfully
3. Update `CHANGELOG.md` for user-facing changes
4. Update `SOURCE-OF-TRUTH.md` if deployment or architecture changes

## Pull Request Guidelines

- One feature or fix per PR
- Match existing code style (TypeScript, Tailwind v4, React 19)
- Keep Give A Bit branding and Safe Harbour language in public-facing copy
- Never commit secrets (`GEMINI_API_KEY`, `VITE_FIREBASE_*` values)
- Test on both desktop and mobile viewport sizes

## Code of Conduct

- Be respectful and constructive
- Focus on Bitcoin sovereignty, privacy, and education
- Follow Safe Harbour principles in all public documentation

## Questions?

Open an issue on GitHub or reach out via [giveabit.io](https://giveabit.io).

---

*Part of the [Give A Bit](https://giveabit.io) family.*