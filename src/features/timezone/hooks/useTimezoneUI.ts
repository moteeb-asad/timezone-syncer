import { useState, useCallback } from "react";
import type { TimezoneOption } from "../types";

/**
 * UI state management for timezone dialogs and selections
 * Handles local component state
 */
export const useTimezoneUI = () => {
  const [showAddTimezone, setShowAddTimezone] = useState(false);
  const [selectedTimezone, setSelectedTimezone] =
    useState<TimezoneOption | null>(null);
  const [popupError, setPopupError] = useState<string | null>(null);

  const handleTimezoneChange = useCallback((option: TimezoneOption | null) => {
    setSelectedTimezone(option);
    setPopupError(null);
  }, []);

  const closeDialog = useCallback(() => {
    setShowAddTimezone(false);
    setSelectedTimezone(null);
    setPopupError(null);
  }, []);

  const openDialog = useCallback(() => {
    setShowAddTimezone(true);
  }, []);

  return {
    showAddTimezone,
    selectedTimezone,
    popupError,
    handleTimezoneChange,
    setShowAddTimezone,
    setSelectedTimezone,
    setPopupError,
    openDialog,
    closeDialog,
  };
};
