import AuthenticatedLayout from "../layout/AuthenticatedLayout.tsx";
import { Switch } from "../components/ui/switch";
import {
  useOwnAdminProfileQuery,
  useToggleTwoFactorAuthenticationMutation,
} from "../queries/auth.query.ts";

const SecurityPage = () => {
  const { data: profile, isLoading } = useOwnAdminProfileQuery();
  const toggleTwoFactorMutation = useToggleTwoFactorAuthenticationMutation();

  const handleToggle = () => {
    toggleTwoFactorMutation.mutate();
  };

  return (
    <AuthenticatedLayout>
      <div className="p-6 max-w-2xl">
        <div className="mb-6">
          <h2 className="text-lg font-semibold">Security</h2>
          <p className="text-sm text-[#9A9A9A]">
            Manage the security settings for your admin account.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#EDEDED] p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-[15px] font-semibold text-[#0E0F0C]">
                Two-Factor Authentication
              </h3>
              <p className="text-[13px] text-[#9A9A9A] mt-1 max-w-md">
                When enabled, a verification code will be sent to your email
                every time you sign in.
              </p>
            </div>

            <Switch
              checked={!!profile?.twoFactorEnabled}
              disabled={isLoading || toggleTwoFactorMutation.isPending}
              onCheckedChange={handleToggle}
            />
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default SecurityPage;
