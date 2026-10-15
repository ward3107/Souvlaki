# Safe dependency updates

## Activation

This pull request prepares checks; it does not activate repository settings.
Protect `main` with a ruleset that requires pull requests, an up-to-date branch, and the following successful checks:

- `Lint`
- `Type Check`
- `Test`
- `E2E Tests`
- `Build`

Apply the rule to administrators and bots; do not give update bots a bypass. Keep automatic merging disabled during rollout. Check names must match GitHub's displayed names after their first run. A skipped, missing, cancelled, or pending check is not evidence of a passing test.

## Update procedure

Dependabot opens bounded weekly update PRs. Review each update separately, keep the lockfile in the same PR as its manifest, and merge only after the checks pass on the latest revision. Major versions and changes to framework, authentication, payment, database, or deployment packages need explicit review of release notes and affected user journeys. Existing security checks must remain enabled; a vulnerable dependency needs a fix, not an ignored failure.

Before merging, open the hosting preview and verify the home page, navigation, and the site's main user action on desktop and mobile. Use test accounts and test data for any submission. Build and unit checks alone do not prove production integrations work.

## Publication and recovery

Configure the hosting provider to publish production only from the protected branch. Check that native Git integrations and other deploy hooks cannot publish unreviewed branches. After release, verify the production URL and primary user journey. Record the previous working deployment before release; if verification fails, restore that deployment using the host's rollback control, then revert the offending update through a reviewed PR. Database migrations and external side effects need their own recovery plan.

Postdeployment monitoring and automatic rollback are not installed by this PR: they require a verified production URL, health contract, and hosting access.

## Repository-specific notes

Classic branch protection already requires the five checks above. A separate ruleset contains a single combined check string rather than five distinct contexts; correct or remove that malformed requirement in repository settings. This PR stops the workflow from enabling new auto-merges. Review already-open PRs and disable any auto-merge that was queued before this change; replacing a workflow does not cancel an existing auto-merge request.
