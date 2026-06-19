# Release Process

Ruang Usaha Kita does not require a heavy release process yet, but public tags should still be deliberate and traceable.

## Release Goals

- Make public milestones easier to review
- Keep repository documentation aligned with shipped code
- Avoid tagging states with broken setup or misleading claims

## Before a Release Tag

1. Confirm the default branch is stable enough for public review
2. Run `npm run check`
3. Review the changelog
4. Verify README, CONTRIBUTING, and SECURITY are still accurate
5. Confirm no local-only setup instructions leaked into committed docs
6. Confirm environment variables documented in `.env.example` are still correct

## If the Release Includes Database Work

Also confirm:

1. Migration files are in the expected order
2. No old migration was edited
3. SQL helper files still match current schema assumptions
4. Release notes do not imply migrations are already applied in every environment

## Changelog Update

Before tagging:

- Move completed work from `Unreleased` into a versioned section
- Keep release notes honest and concise
- Mention repository maintenance changes if they affect contributors

## Tagging Guidance

Suggested format:

```txt
v0.x.y
```

Use a patch or minor bump depending on how visible the repository-level change is to contributors and reviewers.

## After Release

- Verify GitHub community files still render correctly
- Check CI on the tagged commit
- Review whether new follow-up issues or roadmap updates should be created
