# Workflow Patterns

## Sequential Workflows

For complex tasks, break operations into clear, sequential steps. It is often helpful to give an overview early in SKILL.md:

```markdown
Example process:

1. Analyze input
2. Generate plan
3. Execute steps
4. Validate output
5. Iterate fixes
```

## Conditional Workflows

For tasks with branching logic, guide decision points:

```markdown
1. Determine the modification type:
   **Creating new content?** → Follow "Creation workflow"
   **Editing existing content?** → Follow "Editing workflow"

2. Creation workflow: [steps]
3. Editing workflow: [steps]
```
