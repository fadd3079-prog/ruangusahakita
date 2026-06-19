# GitHub Settings

Use this checklist for repository settings that are managed in GitHub, not in source code.

## Branch Protection

Recommended protection for `main`:

- Require pull request before merging
- Require at least one approval
- Dismiss stale approvals when new commits are pushed
- Require status checks to pass before merging
- Require the `Quality Checks` CI workflow
- Require branches to be up to date before merging when practical
- Require conversation resolution before merging
- Restrict force pushes
- Restrict branch deletion

For a single-maintainer early-stage project, bypass permissions can stay limited to the repository owner.

## Security Settings

Enable:

- Private vulnerability reporting
- Dependabot alerts
- Dependabot security updates
- Dependency graph
- Secret scanning
- Push protection for secrets if available on the plan

Do not publish sensitive vulnerability details in public issues.

## CodeQL

CodeQL default setup is already preferred for this repository. Do not add a duplicate CodeQL workflow unless default setup is disabled and the maintainer intentionally moves scanning into code.

Review CodeQL alerts by severity:

- Critical and high alerts should be triaged before release tags
- Medium alerts should be reviewed during maintenance cycles
- False positives should be dismissed with a clear reason

## Dependabot

The repository uses `.github/dependabot.yml` for npm and GitHub Actions updates.

Recommended review policy:

- Merge patch updates after CI passes unless the affected package is security-sensitive
- Review minor updates for Next.js, React, Supabase, auth, storage, payment, and testing packages
- Treat major updates as planned maintenance work
- Do not merge dependency updates that break `npm run check`

## Releases

Use GitHub releases only when the repository state is reviewable:

- `npm run check` passes
- README setup instructions are current
- migration requirements are documented
- known limitations are clear
- `CHANGELOG.md` includes the release notes

Suggested next milestone:

```txt
v0.3.0 - Stability, security, and performance
```

Avoid claiming production readiness unless deployment, monitoring, payment, storage, and incident-response assumptions are documented.

