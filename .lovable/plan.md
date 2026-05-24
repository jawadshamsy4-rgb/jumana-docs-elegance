## Why it's 10

New services use `sort_order = (count * 10) + 10`, so the first one gets 10, second 20, etc. The "step of 10" pattern was meant to leave gaps for easy reordering, but it's confusing.

## Change

Switch to simple 1-based sequential numbering.

**`src/routes/admin.services.index.tsx`** (line 39)
- Replace `const max = (services?.length ?? 0) * 10 + 10;` with `const next = (services?.length ?? 0) + 1;`
- Pass `sort_order: next` in the insert.

**Renumber existing rows** via a one-time data update so the current services become 1, 2, 3… in their current display order (ordered by current `sort_order`).

No schema change. Sorting logic (`.order("sort_order")`) stays the same — it still shows lowest first.