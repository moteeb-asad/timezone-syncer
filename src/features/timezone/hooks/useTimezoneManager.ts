import type { UseTimezoneManagerReturn } from "../types";
import { useTimezoneCore } from "./useTimezoneCore";
import { useTimezoneUI } from "./useTimezoneUI";
import { useTimezoneActions } from "./useTimezoneActions";
import { useTimezoneTimeUpdate } from "./useTimezoneTimeUpdate";

/**
 * Main orchestrator hook for timezone management
 * Combines all timezone-related sub-hooks into a unified interface
 *
 * Architecture:
 * - useTimezoneCore: Core state and derived values (Redux selectors, computed props)
 * - useTimezoneUI: UI state management (dialogs, selections, errors)
 * - useTimezoneActions: Action handlers (add, remove, update timezones)
 * - useTimezoneTimeUpdate: Time synchronization (updates displayed times)
 */
export const useTimezoneManager = (): UseTimezoneManagerReturn => {
  // Core state and computed values
  const core = useTimezoneCore();

  // UI state management
  const ui = useTimezoneUI();

  // Action handlers
  const actions = useTimezoneActions({
    baseTime: core.baseTime,
    timezoneSettings: core.timezoneSettings,
    selectedTimezone: ui.selectedTimezone,
    isPremium: core.isPremium,
    setPopupError: ui.setPopupError,
    closeDialog: ui.closeDialog,
  });

  // Time synchronization
  useTimezoneTimeUpdate({
    baseTime: core.baseTime,
    timezoneSettings: core.timezoneSettings,
  });

  return {
    // Core state
    baseTime: core.baseTime,
    timezoneSettings: core.timezoneSettings,
    subscription: core.subscription,
    allTimezones: core.allTimezones,
    baseTimezoneOption: core.baseTimezoneOption,

    // UI state
    showAddTimezone: ui.showAddTimezone,
    selectedTimezone: ui.selectedTimezone,
    popupError: ui.popupError,
    setShowAddTimezone: ui.setShowAddTimezone,
    setSelectedTimezone: ui.setSelectedTimezone,
    setPopupError: ui.setPopupError,

    // Actions
    handleBaseTimezoneChange: actions.handleBaseTimezoneChange,
    handleBaseTimeChange: actions.handleBaseTimeChange,
    handleAddTimezone: actions.handleAddTimezone,
    handleRemoveTimezone: actions.handleRemoveTimezone,
    handleUpgradeClick: actions.handleUpgradeClick,
    handleTimezoneChange: ui.handleTimezoneChange,
  };
};
