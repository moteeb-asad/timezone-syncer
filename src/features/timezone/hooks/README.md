# Timezone Hooks Architecture

This folder contains modular, focused hooks for timezone management. The architecture follows the **Single Responsibility Principle** for better maintainability and testability.

## Hook Structure

### 🎯 `useTimezoneManager.ts` (Orchestrator)

The main entry point that combines all sub-hooks. Use this hook in components.

**What it does:**

- Composes all timezone-related sub-hooks
- Provides a unified interface for components
- No logic implementation (delegation only)

**Usage:**

```tsx
const {
  baseTime,
  subscription,
  handleAddTimezone,
  // ... all other methods
} = useTimezoneManager();
```

---

### 🔵 `useTimezoneCore.ts` (State & Data)

Manages core state access and derived values.

**Responsibilities:**

- Redux state selectors (baseTime, timezoneSettings, user plan)
- Computed values (isPremium, maxTimezones, subscription)
- Static data (all timezones list)
- Memoized values for performance

**When to modify:**

- Adding new Redux state selectors
- Adding derived/computed values
- Changing subscription logic

---

### 🟢 `useTimezoneUI.ts` (UI State)

Handles local UI state (not persisted to Redux).

**Responsibilities:**

- Dialog visibility (showAddTimezone)
- Form selections (selectedTimezone)
- Validation errors (popupError)
- UI helper methods (openDialog, closeDialog)

**When to modify:**

- Adding new modal/dialog states
- Adding form validation states
- Adding temporary UI flags

---

### 🟡 `useTimezoneActions.ts` (Actions)

Contains all action handlers that modify state.

**Responsibilities:**

- Add/remove timezone operations
- Base time/timezone changes
- Navigation (upgrade click)
- Validation logic (duplicate checks)
- Redux dispatch calls

**When to modify:**

- Adding new timezone operations
- Changing validation rules
- Adding new navigation flows

---

### 🟠 `useTimezoneTimeUpdate.ts` (Time Sync)

Keeps displayed times synchronized.

**Responsibilities:**

- Updates timezone cards when base time changes
- Periodic refresh (every 60 seconds)
- Working hours status updates
- Optimized updates (only when changed)

**When to modify:**

- Changing update frequency
- Adding new time-based calculations
- Optimizing performance

---

### 🔴 `useTimezoneSync.ts` (Firestore Sync)

Persists timezone state to Firestore (existing hook).

**Responsibilities:**

- Auto-saves user timezones to cloud
- Debounced writes (1 second)
- User authentication check

**When to modify:**

- Changing save frequency
- Adding offline support
- Changing persistence strategy

---

## Benefits of This Architecture

✅ **Single Responsibility** - Each hook has one clear purpose  
✅ **Testability** - Easy to unit test individual hooks  
✅ **Reusability** - Sub-hooks can be used independently  
✅ **Maintainability** - Changes are isolated to specific hooks  
✅ **Scalability** - Easy to add new features without bloating  
✅ **Composition** - Hooks compose naturally

## Example: Using Sub-Hooks Independently

```tsx
// Use only core state (no actions, no UI)
const { subscription, isPremium } = useTimezoneCore();

// Use only actions (for custom UI)
const { handleAddTimezone } = useTimezoneActions({...});

// Use only UI state (for modals)
const { showDialog, openDialog } = useTimezoneUI();
```

## Adding New Features

1. **New state?** → Add to `useTimezoneCore`
2. **New UI element?** → Add to `useTimezoneUI`
3. **New action?** → Add to `useTimezoneActions`
4. **New sync logic?** → Add to `useTimezoneTimeUpdate`
5. **Don't forget** → Export from `useTimezoneManager`

## Performance Considerations

- `useMemo` used in core hooks for expensive computations
- `useCallback` used for stable function references
- Redux selectors prevent unnecessary re-renders
- Time updates optimized with change detection
