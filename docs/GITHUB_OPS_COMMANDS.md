# GitHub Operations Commands

`gh` was not available in the local environment used for this repository pass. Run these commands from an authenticated maintainer machine.

## Check Authentication

```bash
gh auth status
```

## Create Labels

```bash
gh label create security --color B60205 --description "Security-sensitive work, vulnerability review, or access-control changes"
gh label create performance --color FBCA04 --description "Performance, loading, rendering, or Core Web Vitals work"
gh label create documentation --color 0075CA --description "Documentation, guides, README, or maintainer notes"
gh label create maintenance --color C5DEF5 --description "Repository maintenance, dependency policy, or operational cleanup"
gh label create testing --color 5319E7 --description "Tests, QA, validation, or coverage work"
gh label create accessibility --color D4C5F9 --description "Keyboard, screen reader, contrast, focus, or inclusive UX work"
gh label create frontend --color 1D76DB --description "Frontend UI, client behavior, layout, or interaction work"
gh label create backend --color 0E8A16 --description "Server actions, route handlers, database logic, or backend flow work"
gh label create supabase --color 3ECF8E --description "Supabase Auth, PostgreSQL, RLS, Storage, Realtime, or SQL work"
gh label create release --color FEF2C0 --description "Release planning, changelog, milestone, or release readiness"
gh label create "good first issue" --color 7057FF --description "Small, well-scoped issue suitable for first-time contributors"
gh label create "help wanted" --color 008672 --description "Maintainer welcomes contributor help"
```

If a label already exists, update it instead:

```bash
gh label edit security --color B60205 --description "Security-sensitive work, vulnerability review, or access-control changes"
gh label edit performance --color FBCA04 --description "Performance, loading, rendering, or Core Web Vitals work"
gh label edit documentation --color 0075CA --description "Documentation, guides, README, or maintainer notes"
gh label edit maintenance --color C5DEF5 --description "Repository maintenance, dependency policy, or operational cleanup"
gh label edit testing --color 5319E7 --description "Tests, QA, validation, or coverage work"
gh label edit accessibility --color D4C5F9 --description "Keyboard, screen reader, contrast, focus, or inclusive UX work"
gh label edit frontend --color 1D76DB --description "Frontend UI, client behavior, layout, or interaction work"
gh label edit backend --color 0E8A16 --description "Server actions, route handlers, database logic, or backend flow work"
gh label edit supabase --color 3ECF8E --description "Supabase Auth, PostgreSQL, RLS, Storage, Realtime, or SQL work"
gh label edit release --color FEF2C0 --description "Release planning, changelog, milestone, or release readiness"
gh label edit "good first issue" --color 7057FF --description "Small, well-scoped issue suitable for first-time contributors"
gh label edit "help wanted" --color 008672 --description "Maintainer welcomes contributor help"
```

## Create Milestone

```bash
gh api repos/fadd3079-prog/ruangusahakita/milestones -f title="v0.3.0 - Stability, security, and performance" -f description="Focused maintenance milestone for security review, performance, tests, accessibility, documentation, and release readiness."
```

## Create Issues

Use the full issue bodies from `docs/ISSUE_BACKLOG.md`. These shorter commands create the issues with labels and milestone.

```bash
gh issue create --title "Security: review Supabase RLS, storage, and role-based access" --label security --label supabase --label backend --milestone "v0.3.0 - Stability, security, and performance" --body-file docs/ISSUE_BACKLOG.md
gh issue create --title "Performance: audit bundle size and critical page loading" --label performance --label frontend --milestone "v0.3.0 - Stability, security, and performance" --body-file docs/ISSUE_BACKLOG.md
gh issue create --title "Testing: expand coverage for order, payment, delivery, and revision flow" --label testing --label backend --milestone "v0.3.0 - Stability, security, and performance" --body-file docs/ISSUE_BACKLOG.md
gh issue create --title "Accessibility: review public marketplace and dashboard navigation" --label accessibility --label frontend --milestone "v0.3.0 - Stability, security, and performance" --body-file docs/ISSUE_BACKLOG.md
gh issue create --title "Docs: improve deployment and Supabase setup verification" --label documentation --label supabase --milestone "v0.3.0 - Stability, security, and performance" --body-file docs/ISSUE_BACKLOG.md
gh issue create --title "Maintenance: review Dependabot PRs and dependency update policy" --label maintenance --milestone "v0.3.0 - Stability, security, and performance" --body-file docs/ISSUE_BACKLOG.md
gh issue create --title "Release: prepare v0.3.0 stability roadmap" --label release --label maintenance --label documentation --milestone "v0.3.0 - Stability, security, and performance" --body-file docs/ISSUE_BACKLOG.md
```

For cleaner issue bodies, copy each matching section from `docs/ISSUE_BACKLOG.md` into the GitHub issue form instead of using the whole file as `--body-file`.

## Review Dependabot Pull Requests

```bash
gh pr list --author app/dependabot --state open
gh pr list --author app/dependabot --state open --json number,title,headRefName,baseRefName,labels,reviewDecision,statusCheckRollup,updatedAt
```

Do not merge or close Dependabot pull requests from this command pass. Review each update by risk and run CI before merging.
