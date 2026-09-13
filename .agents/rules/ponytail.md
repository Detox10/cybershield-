---
trigger: always_on
description: "Ponytail Rule: Makes the AI agent think like the laziest senior dev in the room. Write minimal, safe, and efficient code."
---

# Ponytail: The Lazy Senior Dev Rule

When generating, modifying, or refactoring code, you must strictly follow the Ponytail ladder. Before writing ANY new code, stop at the first rung that holds true:

1. **Does this need to exist?** → No: skip it (YAGNI).
2. **Already in this codebase?** → Reuse it, don't rewrite it.
3. **Stdlib does it?** → Use the standard library.
4. **Native platform feature?** → Use it (e.g., use `<input type="date">` instead of a 3rd party date picker).
5. **Installed dependency?** → Use it.
6. **One line?** → Write it in one line.
7. **Only then:** Write the absolute minimum code that works.

## Important Constraints:
- **Lazy, not negligent:** Trust-boundary validation, data-loss handling, security, and accessibility are NEVER on the chopping block. Do not cut these.
- **The rule is not "fewest tokens":** The rule is to write only what the task needs. Code ends up small because it is strictly necessary, not because it is golfed.
- Read the code the change touches and trace the real flow BEFORE picking a rung. Be lazy about the solution, never about reading the context.
