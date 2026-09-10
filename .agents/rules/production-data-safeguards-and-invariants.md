# Architectural Rules: Production Data Safeguards, Multi-Entity Management & Database Invariants

Whenever building, modifying, or testing single-user control panels, content management systems, multi-session/tenant selectors, or database-backed entities, adhere strictly to these engineering standards.

---

### 1. Soft Deletion & Reversibility (Never Hard-Delete in Production)
- **Zero Raw Deletes**: Never execute raw `DELETE FROM <table>` on production entities with dependent relational data.
- **Archival Flags**: Use `is_archived BOOLEAN DEFAULT false` (or `deleted_at TIMESTAMPTZ`).
- **Query Discipline**: All public-facing and active queries must filter out archived records (`.eq('is_archived', false)` or `.is('deleted_at', null)`).
- **1-Click Restoration**: Admin interfaces must provide a mechanism to view archived records and restore them with one click.

---

### 2. Single Source of Truth & Zero-Shadowing Fallbacks
- **Formal Database Seeding**: Never rely permanently on hardcoded client-side arrays for production foundational data. Baseline records (e.g., pioneer session, admin seed) must exist in the database from day one.
- **Defensive Union on Fallbacks**: If client-side fallback data must exist for offline preview, never replace local state using `if (remote.length > 0) set(remote)`. Always perform a keyed union so baseline items are never shadowed by new remote items.

---

### 3. Safe Creation Defaults (Draft-First Pattern & Zero Pre-filled Mock Data)
- **No Mock Defaults in Forms**: Creation wizards, modals, and input forms must **never** initialize state with realistic dummy text (e.g., `useState('2026/2027')`).
- **Empty State Initialization**: Initialize state strictly with empty strings (`useState('')`). Use HTML `placeholder` attributes for example guidance.
- **Default to Inactive / Draft**: Newly created entities must default to `is_active: false` (or `status: 'draft'`).
- **Prevent Production Hijacking**: Never allow an empty or unpopulated record to automatically replace the active production landing page upon creation.
- **Explicit Activation**: Promoting an entity to the live public view must require an explicit, deliberate user action ("Set as Active Landing View").

---

### 4. Separate Core Identity from Operational Flags in Immutability Triggers
When creating PostgreSQL triggers to safeguard foundational, pioneer, or seed records from being deleted or corrupted:
- **Never block ALL updates unconditionally**.
- Differentiate between **Core Identity** (`id`, `session_code`, `slug`, `theme_title`, `is_pioneer`) and **Operational Flags** (`is_active`, `display_order`, `updated_at`).
- Allow operational flags to be updated so that administrators can switch active landing views without database exceptions:
```sql
CREATE OR REPLACE FUNCTION prevent_pioneer_edit()
RETURNS TRIGGER AS $$
BEGIN
  -- Strict: Never permit raw deletion of foundational entities
  IF TG_OP = 'DELETE' AND OLD.is_pioneer = true THEN
    RAISE EXCEPTION 'Foundational entity data cannot be deleted.';
  END IF;

  -- Controlled: Only block modifications to core identity, allow operational flags (like is_active)
  IF TG_OP = 'UPDATE' AND OLD.is_pioneer = true THEN
    IF NEW.id <> OLD.id OR NEW.session_code <> OLD.session_code OR NEW.theme_title <> OLD.theme_title OR NEW.is_pioneer <> true THEN
      RAISE EXCEPTION 'Foundational entity core identity is immutable.';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

---

### 5. PostgREST / Supabase Mutation Row-Count Verification
In PostgREST, a query returns HTTP 200/204 with `error: null` and `data: []` (or `null`) when Row-Level Security (RLS) silently prevents a mutation or no rows match.
- **Always verify row count**: Append `.select()` on mutations and verify that `data && data.length > 0`.
- **Detect silent RLS failure**: If `!error` and `(!data || data.length === 0)`, notify the user of a permission restriction rather than falsely displaying success.

---

### 6. Content-Aware Landing Selection with Graceful Fallback
- Never let an empty or unpopulated entity hijack the public homepage.
- If an active entity has zero child records, either:
  1. Default the public view to the latest populated / flagship entity.
  2. Or render a curated "Season In Preparation" announcement card with a one-click button to view the previous completed entity.

---

### 7. Mutual Exclusivity & Single-Active Invariants
- **Database-Level Partial Unique Index**:
  When only one record should be active at a time, enforce this in SQL:
  ```sql
  CREATE UNIQUE INDEX single_active_session_idx 
  ON academic_sessions (is_active) 
  WHERE (is_active = true);
  ```
- **Client-Side Deduplication Normalizer**:
  Always normalize multi-entity arrays before rendering to guarantee only one "Active" badge can display.

---

### 8. Emergency Admin DB Cleanups in SQL Editor
When executing manual database cleanups in the Supabase SQL Editor that might be constrained by RLS policies:
- Explicitly run as the `postgres` superuser role.
- If needed, wrap the operation in replica mode to bypass triggers and RLS safely:
  ```sql
  SET session_replication_role = 'replica';
  DELETE FROM table_name WHERE id = '...';
  SET session_replication_role = 'origin';
  ```

---

### 9. Mandatory Automated Testing Scenarios
Before releasing admin-controlled features, verify these test cases:
1. **Shadowing Test**: Adding entity `N` does not hide foundational entity `0` from selectors.
2. **Mutual Exclusivity Test**: Marking entity `B` active atomically demotes entity `A`; verify two active tags never render simultaneously.
3. **Empty-State Safety**: Visiting an unpopulated entity displays a graceful empty state without breaking navigation.
4. **Soft-Delete & Restore Test**: Archiving an entity removes it from the public view, keeps child records intact, and can be fully restored.
5. **Mutation Verification Test**: Ensure delete/update alerts if 0 rows were affected by RLS.
