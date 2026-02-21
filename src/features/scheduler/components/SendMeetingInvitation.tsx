import { Modal } from "../../../components/ui/Modal";
import { Button } from "../../../components/ui/Button";

interface SendMeetingInvitationProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SendMeetingInvitation = ({
  isOpen,
  onClose,
}: SendMeetingInvitationProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Send Meeting Invitation">
      <div className="p-6 space-y-5">
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Recipients
          </label>
          <div className="flex flex-wrap gap-2 p-2 border border-slate-200 rounded-lg focus-within:ring-1 focus-within:ring-primary-accent focus-within:border-primary-accent min-h-[42px] bg-slate-50/50">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-600">
              <span>sarah.j@company.com</span>
              <span className="material-symbols-outlined text-sm cursor-pointer hover:text-rose-500">
                close
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-600">
              <span>mike.t@org.net</span>
              <span className="material-symbols-outlined text-sm cursor-pointer hover:text-rose-500">
                close
              </span>
            </div>
            <input
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm p-0 h-6 min-w-[100px]"
              placeholder="Add email..."
              type="text"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Subject
          </label>
          <input
            className="w-full text-sm font-medium border-slate-200 rounded-lg focus:ring-1 focus:ring-primary-accent focus:border-primary-accent bg-slate-50/50"
            type="text"
            defaultValue="Team Sync - Timezone Overlap"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Meeting Window
          </label>
          <div className="bg-slate-900 text-white rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-slate-300">
                3:00 PM - 5:00 PM (Local)
              </span>
              <span className="material-symbols-outlined text-primary-accent text-sm">
                schedule
              </span>
            </div>
            <div className="grid grid-cols-1 gap-2 border-t border-slate-800 pt-3">
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-slate-400 font-medium">
                  Adak, US
                </span>
                <span className="text-xs font-bold">1:00 AM - 3:00 AM</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-slate-400 font-medium">
                  Guatemala, GT
                </span>
                <span className="text-xs font-bold">5:00 AM - 7:00 AM</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-slate-400 font-medium">
                  Honolulu, US
                </span>
                <span className="text-xs font-bold">1:00 AM - 3:00 AM</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Personal Note
          </label>
          <textarea
            className="w-full text-sm font-medium border-slate-200 rounded-lg focus:ring-1 focus:ring-primary-accent focus:border-primary-accent bg-slate-50/50 resize-none"
            placeholder="Add a short message for the participants..."
            rows={3}
          />
        </div>
      </div>

      <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-end gap-3">
        <Button
          variant="outline"
          onClick={onClose}
          className="px-4 py-2 text-xs uppercase tracking-wider"
        >
          Cancel
        </Button>
        <Button className="px-6 py-2.5 bg-primary-accent hover:bg-[#ef5a46] text-white text-xs uppercase tracking-wider">
          <span className="material-symbols-outlined text-sm">send</span>
          Send Invites via Email
        </Button>
      </div>
    </Modal>
  );
};
