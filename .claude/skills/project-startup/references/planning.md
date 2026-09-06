# Goals and the project plan

Runs in Phase 11, the last phase of `/project-startup`, after the ruleset is
written and reviewed (Phase 10) and the user has said they don't want to add
any more rules. Output: `ProjectPlan.md`, and possibly edits to
`REQUIREMENTS.md` if the goals conversation surfaces something new.

This phase does not re-run Phase 4. It asks one question Phase 4 could not yet
ask — *now that you've seen the ruleset take shape, has anything about what you
want built changed or come into focus?* — then sequences whatever
`REQUIREMENTS.md` currently holds into a build-ready order. It schedules the
spec; it does not replace it.

---

## Why this comes after the ruleset, not before

Phase 4 wrote `REQUIREMENTS.md` from the business background and the input
analysis, before any rule existed. That ordering is right for *rule selection*
— the domains worth working through depend on what the project is. It is not
guaranteed to be right for *planning the build*: a user who has just spent
several domains thinking hard about verification, architecture boundaries, and
scope will sometimes realize a requirement was underspecified, missing, or no
longer wanted. Asking again here, once, catches that before the build loop
starts on a stale spec.

## Process

### 1. Ask directly

Ask the user, in your own words: has anything changed since `REQUIREMENTS.md`
was written? Is there a new goal, now that the ruleset exists, that isn't
captured? Is anything in there no longer wanted?

This is a real question, not a formality — do not skip it because
`REQUIREMENTS.md` looks complete. An unchanged answer is a fine outcome and
costs one exchange to confirm.

### 2. Reconcile, one item at a time

Anything new or changed goes through the same clarity bar as Phase 4
(`references/requirements.md`): done is decidable, every term is defined, one
reading, the boundary is stated, no undecided dependency. One item at a time,
same verdict discipline as everywhere else in this skill.

**Never silently rewrite an existing requirement.** Propose the change as its
own edit, old text shown alongside, same as the rule from
`.claude/skills/project-startup/SKILL.md`'s re-running section. Update
`REQUIREMENTS.md` as each is resolved.

### 3. Sequence into `ProjectPlan.md`

Once `REQUIREMENTS.md` reflects current goals, walk the **open** requirements
and turn them into plan items using the shape in `references/templates.md`.

- One item is one pass through plan → offer solution → build → verify →
  finish. A requirement too large for one pass becomes several items, each
  citing the same requirement id.
- Order for dependency first, then for risk — the item most likely to change
  the approach for later items goes early, not last.
- An item with no requirement id behind it is not ready to schedule; it is
  either a missing requirement (go back to step 2) or not in scope.

Present the proposed sequence — titles only, not full items — so the user can
see the shape and reorder before anything is written out in full. Get one
verdict on the order, then write `ProjectPlan.md`.

### 4. Close the run

- Confirm `REQUIREMENTS.md` and `ProjectPlan.md` are both saved.
- Tell the user `/project-build` is the companion skill that does the actual
  building: it resumes from `ProjectPlan.md`, takes the next open item through
  plan → offer solution → build → verify → finish, and can be run again in a
  later session for the next item.
- **Tell the user to `/clear` before running `/project-build`.** This session
  holds the full interview; the build loop wants a clean context holding only
  the ruleset and the plan, the same reasoning Phase 10 already gives for
  clearing before implementation.

## If `REQUIREMENTS.md` is empty or missing

This can happen on a ruleset-only run, or a re-run against an existing
ruleset where Phase 4 was skipped or its output was never committed. Say so,
then run the clarity-bar process from scratch as if it were Phase 4, using
whatever the user states now as the only source — do not backfill it from the
ruleset or from the input analysis, since neither was written to answer "what
do you want built."

## If the user has nothing more to add and no code exists yet

`ProjectPlan.md` can be empty or hold a single item — that is a legitimate
outcome, not a failure of this phase. Do not manufacture items to fill it.
