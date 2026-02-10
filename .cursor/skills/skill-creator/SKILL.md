---
name: skill-creator
description: Create and update Cursor skills under .cursor/skills/<skill-name>/. Use when I ask to make a new skill, refactor prompts into a reusable skill package, add scripts/references/assets to a skill, or standardize deterministic outputs for repetitive workflows.
---

# Skill Creator (Cursor edition)

This skill helps you create effective Cursor skills as small, reusable packages.

## What a Cursor Skill is (practical)

A skill is a folder under:
- .cursor/skills/<skill-name>/

At minimum it contains:
- SKILL.md (required)

Optionally it can include:
- scripts/     (executable helpers for deterministic work)
- references/  (docs to read only when needed)
- assets/      (templates/boilerplate used in final outputs)

**Important**: Keep SKILL.md lean. Put long templates / heavy reference docs into references/ to avoid context bloat.

## Core principles (token-efficient)

1) Default assumption: the model is already smart. Only add context that is non-obvious or project-specific.
2) The real trigger is the YAML frontmatter description. Put WHEN to use the skill there.
3) Keep outputs deterministic. If output must be copy-pastable, define an exact format.

## Skill creation workflow (Cursor)

Follow these steps in order:

### Step 1 — Understand usage examples
- Ask for 2–5 example user requests that should trigger the skill.
- If none are provided, propose examples and confirm quickly.

### Step 2 — Plan the package
Decide what belongs where:
- SKILL.md: minimal workflow + output rules
- references/: long schemas, domain rules, policies, examples
- scripts/: deterministic operations you keep rewriting (generators, converters, validators)
- assets/: boilerplate templates to copy into outputs

Prefer minimal package first: SKILL.md only. Add files only if they will be reused.

### Step 3 — Implement the skill in .cursor/skills/
Create:
- .cursor/skills/<skill-name>/SKILL.md
Optionally create:
- scripts/, references/, assets/

### Step 4 — Enforce output patterns
If outputs must be consistent, use references/output-patterns.md.

### Step 5 — Validate (optional but recommended)
Use scripts/quick_validate.py to sanity-check YAML frontmatter rules.

### Step 6 — Iterate from real use
- Use the skill on real tasks
- Notice failure modes / missing guardrails
- Update SKILL.md or add a script/reference file

---

## What to NOT include
Do NOT create extra docs like README/CHANGELOG/etc. Only include files that directly improve the skill's reliability.

---

## Deterministic output contract (MANDATORY)
When I ask you to create/update a skill, you MUST output:

1) A file list (paths only)
2) Full contents for each created/updated file
3) A short "How to trigger" section: example prompts that should activate the skill

Use this exact structure:

## Files
- <path>
- <path>

## File: <path>
```md
<full content>
```

## How to trigger

* "<example prompt 1>"
* "<example prompt 2>"

---

## If I ask for "a tool"

If I ask for a "tool" (TypeScript/MCP/CLI), do NOT implement the full tool inside a skill by default.
Instead:

1. Write a tool spec (inputs/outputs/errors/examples)
2. Provide a stub file plan (folders + filenames)
3. Only implement code if I explicitly ask to generate the code

---

## References in this skill

* See references/workflows.md for sequential/conditional workflow patterns.
* See references/output-patterns.md for strict output templates and examples.

---

## Included helper scripts

These scripts can be run manually from your repo root, e.g.:

python .cursor/skills/skill-creator/scripts/init_skill.py my-skill --path .cursor/skills
python .cursor/skills/skill-creator/scripts/quick_validate.py .cursor/skills/my-skill

Packaging is optional (creates a .skill zip-like artifact):
python .cursor/skills/skill-creator/scripts/package_skill.py .cursor/skills/my-skill ./dist
