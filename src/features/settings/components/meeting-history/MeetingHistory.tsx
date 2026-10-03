import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { MeetingHistoryPremiumGate } from "./MeetingHistoryPremiumGate";
import { MeetingHistoryContent } from "./MeetingHistoryContent";

export const MeetingHistory = () => {
  const { plan } = useSelector((state: RootState) => state.user);
  // If plan is undefined/null, show loading spinner (prevents jerk)
  if (plan == null) {
    return (
      <div className="flex justify-center items-center h-40">Loading...</div>
    );
  }
  const isPremium = plan === "premium";
  if (!isPremium) {
    return <MeetingHistoryPremiumGate />;
  }
  return <MeetingHistoryContent />;
};
