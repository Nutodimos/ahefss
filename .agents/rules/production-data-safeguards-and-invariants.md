# Architectural Rules: Production Data Safeguards, Soft Deletes & Invariants

Whenever building, modifying, or testing single-user control panels, content management systems, or database entities, adhere strictly to these engineering standards.

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

### 3. Safe Creation Defaults (Draft-First Pattern)
- **Default to Inactive / Draft**: Newly created entities must default to `is_active: false` (or `status: 'draft'`).
- **Prevent Production Hijacking**: Never allow an empty or unpopulated record to automatically replace the active production landing page upon creation.
- **Explicit Activation**: Promoting an entity to the live public view must require an explicit, deliberate user action ("Set as Active Landing View").

---

### 4. Mutual Exclusivity & Single-Active Invariants
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

### 5. Mandatory Automated Testing Scenarios
Before releasing admin-controlled features, verify these test cases:
1. **Shadowing Test**: Adding entity `N` does not hide foundational entity `0` from selectors.
2. **Mutual Exclusivity Test**: Marking entity `B` active atomically demotes entity `A`; verify two active tags never render simultaneously.
3. **Empty-State Safety**: Visiting an unpopulated entity displays a graceful empty state without breaking navigation.
4. **Soft-Delete & Restore Test**: Archiving an entity removes it from the public view, keeps child records intact, and can be fully restored.
