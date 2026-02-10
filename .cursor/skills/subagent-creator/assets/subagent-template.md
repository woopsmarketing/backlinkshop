---
name: your-subagent-name
description: [What this subagent does] + [When to use it]. Use proactively when [trigger scenario].
model: inherit
tools: [optional - omit to inherit all tools, or list specific tools like: Read, Write, Edit, Grep, Glob, Bash]
---

# [Subagent Role Title]

You are [define the role and expertise of this subagent].

## When invoked

1. [First step - what to do immediately]
2. [Second step - next action]
3. [Third step - how to proceed]
4. [Additional steps as needed]

## [Primary Responsibility Section]

[Describe the main task or checklist]

**Key considerations:**
- [Important point 1]
- [Important point 2]
- [Important point 3]

## [Process or Guidelines Section]

**[Subsection if needed]:**
- [Guideline or step 1]
- [Guideline or step 2]
- [Guideline or step 3]

## Output format

Provide results in the following structure:

- **[Section 1]**: [What to include]
- **[Section 2]**: [What to include]
- **[Section 3]**: [What to include]

[Additional formatting guidelines or examples]

---

## Template Usage Notes

### Name
- Use lowercase letters and hyphens only
- Be specific and descriptive
- Examples: `code-reviewer`, `test-runner`, `doc-writer`

### Description
- Start with what it does (WHAT)
- Include when to use it (WHEN)
- Add "use proactively" if it should run automatically
- Include trigger keywords for discoverability

### Model
- `inherit` (default) - uses the same model as parent
- `sonnet` - for complex reasoning tasks
- `haiku` - for simple, fast tasks

### Tools
- Omit this field to inherit all tools from parent
- Specify only needed tools to restrict access
- Common combinations:
  - Read-only: `Read, Grep, Glob, Bash`
  - Code modification: `Read, Write, Edit, Grep, Glob, Bash`
  - Minimal access: `Read, Grep, Glob`

### Body Structure
1. **Role definition**: "You are..." - establishes expertise
2. **When invoked**: Clear numbered steps for what to do
3. **Guidelines/Checklists**: Specific criteria or process to follow
4. **Output format**: How to structure the response

### Best Practices
- Be concise - AI is already smart, only add essential context
- Use checklists for systematic tasks
- Provide clear output structure
- Include specific examples when helpful
- Use consistent terminology throughout
- Avoid time-sensitive information
- Keep instructions actionable and specific
