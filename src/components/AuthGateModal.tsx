import { Link } from 'react-router-dom';
import { LogIn, UserPlus } from 'lucide-react';
import { Modal, Button } from './ui';

export function AuthGateModal({
  isOpen,
  onClose,
  returnPath = '/',
}: {
  isOpen: boolean;
  onClose: () => void;
  returnPath?: string;
}) {
  const profileUrl = `/profile?return=${encodeURIComponent(returnPath)}`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Sign in to launch">
      <div className="p-6 pt-10 space-y-4 text-center">
        <p className="text-sm text-muted leading-relaxed">
          Sign in before payment so your campaign is saved to your account.
          You can still browse and build without an account — we just need you
          signed in before checkout.
        </p>
        <div className="flex flex-col gap-2">
          <Link to={profileUrl} onClick={onClose}>
            <Button className="w-full gap-2">
              <LogIn className="w-4 h-4" />
              Sign In
            </Button>
          </Link>
          <Link to={`${profileUrl}&tab=signup`} onClick={onClose}>
            <Button variant="secondary" className="w-full gap-2">
              <UserPlus className="w-4 h-4" />
              Create Account
            </Button>
          </Link>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-muted">
            Keep editing
          </Button>
        </div>
      </div>
    </Modal>
  );
}