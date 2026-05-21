import { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, Plus, Trash2, Edit2, AlertTriangle, ShieldCheck, RefreshCcw } from 'lucide-react';
import AuthenticatedLayout from '../layout/AuthenticatedLayout.tsx';
import PageHeader from '../components/global/pageHeader.tsx';
import { PillInput } from '../components/ui/input';
import { PillSelect } from '../components/ui/select';
import { useKycQuery } from '../queries/kyc.querries';
import {
  setCreateKycTierLimitField,
  setUpdateKycTierLimitField,
  setUpdateKycTierLimitId,
  setDeleteKycTierLimitId,
  clearCreateKycTierLimit,
  clearUpdateKycTierLimit,
  clearDeleteKycTierLimitId,
} from '../redux/kyc-tier-limit.slice';
import type { RootState } from '../store';
import type { KycTierType } from '../schemas/kyc.schema';
import CustomButton from '../components/global/Button';

const boolOptions = [
  { value: 'true', label: 'Active' },
  { value: 'false', label: 'Inactive' },
];

const TIER_LABELS: Record<KycTierType, string> = {
  GUEST: 'Guest — unverified users',
  VERIFIED: 'Verified — full verification',
};

const tierOptions = [
  { value: 'GUEST', label: 'Guest — unverified users' },
  { value: 'VERIFIED', label: 'Verified — full verification' },
];

const KycTierLimits = () => {
  const dispatch = useDispatch();
  const { create: createForm, update: updateFormState } = useSelector((s: RootState) => s.kycTierLimit);
  const updateForm = updateFormState;
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const {
    kycTierLimits,
    loadingKycTierLimits,
    createKycTierLimitMutation,
    updateKycTierLimitMutation,
    deleteKycTierLimitMutation,
  } = useKycQuery();

  const groupedLimits = useMemo(() => {
    if (!kycTierLimits) return {} as Record<KycTierType, any[]>;
    return kycTierLimits.reduce((acc: any, limit: any) => {
      if (!acc[limit.kycTier]) acc[limit.kycTier] = [];
      acc[limit.kycTier].push(limit);
      return acc;
    }, {} as Record<KycTierType, any[]>);
  }, [kycTierLimits]);

  function handleCreate() {
    createKycTierLimitMutation.mutate(undefined, {
      onSuccess: (res) => {
        if (res.success) {
          setIsCreateModalOpen(false);
          dispatch(clearCreateKycTierLimit());
        }
      },
    });
  }

  function handleUpdate() {
    updateKycTierLimitMutation.mutate(undefined, {
      onSuccess: (res) => {
        if (res.success) {
          setIsEditModalOpen(false);
          dispatch(clearUpdateKycTierLimit());
        }
      },
    });
  }

  function handleDelete() {
    deleteKycTierLimitMutation.mutate(undefined, {
      onSuccess: (res) => {
        if (res.success) {
          setIsDeleteModalOpen(false);
          dispatch(clearDeleteKycTierLimitId());
        }
      },
    });
  }

  function openEditModal(limit: any) {
    dispatch(setUpdateKycTierLimitId(limit.id));
    dispatch(setUpdateKycTierLimitField({ field: 'kycTier', value: limit.kycTier }));
    dispatch(setUpdateKycTierLimitField({ field: 'currencyCode', value: limit.currencyCode }));
    dispatch(setUpdateKycTierLimitField({ field: 'minTransactionAmount', value: limit.minTransactionAmount }));
    dispatch(setUpdateKycTierLimitField({ field: 'maxTransactionAmount', value: limit.maxTransactionAmount }));
    dispatch(setUpdateKycTierLimitField({ field: 'dailyLimit', value: limit.dailyLimit }));
    dispatch(setUpdateKycTierLimitField({ field: 'monthlyLimit', value: limit.monthlyLimit }));
    dispatch(setUpdateKycTierLimitField({ field: 'maxPayoutAttempts', value: limit.maxPayoutAttempts }));
    dispatch(setUpdateKycTierLimitField({ field: 'isActive', value: limit.isActive }));
    dispatch(setUpdateKycTierLimitField({ field: 'requiredConfirmationsBTC', value: limit.requiredConfirmationsBTC }));
    dispatch(setUpdateKycTierLimitField({ field: 'requiredConfirmationsSOL', value: limit.requiredConfirmationsSOL }));
    dispatch(setUpdateKycTierLimitField({ field: 'requiredConfirmationsTRC20', value: limit.requiredConfirmationsTRC20 }));
    
    setIsEditModalOpen(true);
  }

  function closeCreateModal() {
    setIsCreateModalOpen(false);
    dispatch(clearCreateKycTierLimit());
  }

  function closeEditModal() {
    setIsEditModalOpen(false);
    dispatch(clearUpdateKycTierLimit());
  }

  function openDeleteModal(id: string) {
    dispatch(setDeleteKycTierLimitId(id));
    setIsDeleteModalOpen(true);
  }

  function closeDeleteModal() {
    setIsDeleteModalOpen(false);
    dispatch(clearDeleteKycTierLimitId());
  }

  return (
    <AuthenticatedLayout>
      <PageHeader
        title="KYC Tier Limits"
        subtitle="Manage transaction limits and configurations for different user verification levels"
        actions={
          <CustomButton
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2"
            buttonText="Add New Limit"
          >
            <Plus size={18} />
          </CustomButton>
        }
      />

      <div className="p-6 mx-auto space-y-8">
        {loadingKycTierLimits ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <RefreshCcw className="w-8 h-8 text-[#575AE5] animate-spin" />
            <p className="text-gray-500 font-medium">Loading tier limits...</p>
          </div>
        ) : !kycTierLimits || kycTierLimits.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <ShieldCheck className="w-12 h-12 text-gray-200 mb-4" />
            <p className="text-gray-900 font-semibold">No tier limits configured</p>
            <p className="text-gray-500 text-sm mt-1">Start by adding a limit for one of the KYC tiers.</p>
            <CustomButton
              onClick={() => setIsCreateModalOpen(true)}
              className="mt-6"
              buttonText="Add First Limit"
            />
          </div>
        ) : (
          <div className="space-y-10 pb-20">
            {(['GUEST', 'VERIFIED'] as KycTierType[]).map((tier) => (
              <section key={tier} className="space-y-5">
                <div className="flex items-center gap-3 px-2">
                  <h2 className="text-[20px] font-bold text-[#03034D] capitalize">{TIER_LABELS[tier]}</h2>
                  <div className="h-px flex-1 bg-[#F2F4F7]" />
                  <span className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">
                    {groupedLimits[tier]?.length || 0} config{groupedLimits[tier]?.length === 1 ? '' : 's'}
                  </span>
                </div>

                {!groupedLimits[tier] || groupedLimits[tier].length === 0 ? (
                  <div className="p-6 bg-[#F9FAFB] rounded-3xl text-center">
                    <p className="text-gray-400 text-sm italic">No limits defined for this tier yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                    {groupedLimits[tier].map((limit: any) => (
                      <div
                        key={limit.id}
                        className="bg-white rounded-[32px] border border-[#ECECEC] p-6 transition-all hover:border-[#575AE5] group"
                      >
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-[#F5F5FF] flex items-center justify-center text-[#03034D] font-bold">
                              {limit.currencyCode}
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-[#03034D]">{limit.currencyCode} Limits</h3>
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${limit.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                <span className={`w-1 h-1 rounded-full ${limit.isActive ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                {limit.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <button
                              onClick={() => openEditModal(limit)}
                              className="p-2 rounded-xl text-gray-400 hover:text-[#575AE5] hover:bg-[#F5F5FF] transition-all"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => openDeleteModal(limit.id)}
                              className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-x-8 gap-y-5">
                          <div className="space-y-1">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-left">Trans. Range</p>
                            <p className="text-sm font-bold text-[#03034D] text-left">
                              {limit.minTransactionAmount} — {limit.maxTransactionAmount} <span className="text-[11px] font-medium text-gray-400">{limit.currencyCode}</span>
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-left">Periodic Limits</p>
                            <p className="text-sm font-bold text-[#03034D] text-left">
                              Day: {limit.dailyLimit} | Month: {limit.monthlyLimit}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-left">Payout Attempts</p>
                            <p className="text-sm font-bold text-[#03034D] text-left">Max {limit.maxPayoutAttempts} retries</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-left">Confirms (BTC/SOL/TRC20)</p>
                            <p className="text-sm font-bold text-[#03034D] text-left">
                              {limit.requiredConfirmationsBTC} / {limit.requiredConfirmationsSOL} / {limit.requiredConfirmationsTRC20}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            ))}
          </div>
        )}

        {/* Create Modal */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
            <div className="bg-white rounded-[32px] w-full max-w-2xl mx-4 p-8 max-h-[90vh] overflow-y-auto shadow-2xl border border-[#ECECEC]">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-[22px] font-bold text-[#03034D]">Add KYC Tier Limit</h3>
                <button
                  onClick={closeCreateModal}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                <PillSelect
                  label="KYC Tier"
                  options={tierOptions}
                  value={createForm.kycTier}
                  onValueChange={(v) => dispatch(setCreateKycTierLimitField({ field: 'kycTier', value: v as any }))}
                />
                <PillInput
                  label="Currency Code"
                  placeholder="e.g. NGN"
                  value={createForm.currencyCode}
                  onChange={(e) => dispatch(setCreateKycTierLimitField({ field: 'currencyCode', value: e.target.value.toUpperCase() }))}
                />
                <PillInput
                  label="Min Transaction Amount"
                  type="number"
                  placeholder="0"
                  value={createForm.minTransactionAmount}
                  onChange={(e) => dispatch(setCreateKycTierLimitField({ field: 'minTransactionAmount', value: parseFloat(e.target.value) || 0 }))}
                />
                <PillInput
                  label="Max Transaction Amount"
                  type="number"
                  placeholder="0"
                  value={createForm.maxTransactionAmount}
                  onChange={(e) => dispatch(setCreateKycTierLimitField({ field: 'maxTransactionAmount', value: parseFloat(e.target.value) || 0 }))}
                />
                <PillInput
                  label="Daily Limit"
                  type="number"
                  placeholder="0"
                  value={createForm.dailyLimit}
                  onChange={(e) => dispatch(setCreateKycTierLimitField({ field: 'dailyLimit', value: parseFloat(e.target.value) || 0 }))}
                />
                <PillInput
                  label="Monthly Limit"
                  type="number"
                  placeholder="0"
                  value={createForm.monthlyLimit}
                  onChange={(e) => dispatch(setCreateKycTierLimitField({ field: 'monthlyLimit', value: parseFloat(e.target.value) || 0 }))}
                />
                <PillInput
                  label="Max Payout Attempts"
                  type="number"
                  placeholder="3"
                  value={createForm.maxPayoutAttempts}
                  onChange={(e) => dispatch(setCreateKycTierLimitField({ field: 'maxPayoutAttempts', value: parseInt(e.target.value) || 3 }))}
                />
                <PillSelect
                  label="Status"
                  options={boolOptions}
                  value={String(createForm.isActive)}
                  onValueChange={(v) => dispatch(setCreateKycTierLimitField({ field: 'isActive', value: v === 'true' }))}
                />
                <PillInput
                  label="BTC Confirmations"
                  type="number"
                  placeholder="1"
                  value={createForm.requiredConfirmationsBTC}
                  onChange={(e) => dispatch(setCreateKycTierLimitField({ field: 'requiredConfirmationsBTC', value: parseInt(e.target.value) || 1 }))}
                />
                <PillInput
                  label="SOL Confirmations"
                  type="number"
                  placeholder="1"
                  value={createForm.requiredConfirmationsSOL}
                  onChange={(e) => dispatch(setCreateKycTierLimitField({ field: 'requiredConfirmationsSOL', value: parseInt(e.target.value) || 1 }))}
                />
                <PillInput
                  label="TRC20 Confirmations"
                  type="number"
                  placeholder="1"
                  value={createForm.requiredConfirmationsTRC20}
                  onChange={(e) => dispatch(setCreateKycTierLimitField({ field: 'requiredConfirmationsTRC20', value: parseInt(e.target.value) || 1 }))}
                />
              </div>

              <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-[#F2F4F7]">
                <CustomButton
                  variant="button"
                  onClick={closeCreateModal}
                  className="bg-white !text-[#03034D] border border-[#ECECEC] hover:bg-gray-50 px-8"
                  buttonText="Cancel"
                />
                <CustomButton
                  onClick={handleCreate}
                  disabled={createKycTierLimitMutation.isPending}
                  className="px-10"
                  buttonText={createKycTierLimitMutation.isPending ? 'Creating...' : 'Create Tier Limit'}
                />
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {isEditModalOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
            <div className="bg-white rounded-[32px] w-full max-w-2xl mx-4 p-8 max-h-[90vh] overflow-y-auto shadow-2xl border border-[#ECECEC]">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-[22px] font-bold text-[#03034D]">Edit KYC Tier Limit</h3>
                <button
                  onClick={closeEditModal}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                <PillSelect
                  label="KYC Tier"
                  options={tierOptions}
                  value={updateForm.data.kycTier ?? ''}
                  onValueChange={(v) => dispatch(setUpdateKycTierLimitField({ field: 'kycTier', value: v as any }))}
                />
                <PillInput
                  label="Currency Code"
                  placeholder="e.g. NGN"
                  value={updateForm.data.currencyCode ?? ''}
                  onChange={(e) => dispatch(setUpdateKycTierLimitField({ field: 'currencyCode', value: e.target.value.toUpperCase() }))}
                />
                <PillInput
                  label="Min Transaction Amount"
                  type="number"
                  placeholder="0"
                  value={updateForm.data.minTransactionAmount ?? ''}
                  onChange={(e) => dispatch(setUpdateKycTierLimitField({ field: 'minTransactionAmount', value: parseFloat(e.target.value) || 0 }))}
                />
                <PillInput
                  label="Max Transaction Amount"
                  type="number"
                  placeholder="0"
                  value={updateForm.data.maxTransactionAmount ?? ''}
                  onChange={(e) => dispatch(setUpdateKycTierLimitField({ field: 'maxTransactionAmount', value: parseFloat(e.target.value) || 0 }))}
                />
                <PillInput
                  label="Daily Limit"
                  type="number"
                  placeholder="0"
                  value={updateForm.data.dailyLimit ?? ''}
                  onChange={(e) => dispatch(setUpdateKycTierLimitField({ field: 'dailyLimit', value: parseFloat(e.target.value) || 0 }))}
                />
                <PillInput
                  label="Monthly Limit"
                  type="number"
                  placeholder="0"
                  value={updateForm.data.monthlyLimit ?? ''}
                  onChange={(e) => dispatch(setUpdateKycTierLimitField({ field: 'monthlyLimit', value: parseFloat(e.target.value) || 0 }))}
                />
                <PillInput
                  label="Max Payout Attempts"
                  type="number"
                  placeholder="3"
                  value={updateForm.data.maxPayoutAttempts ?? ''}
                  onChange={(e) => dispatch(setUpdateKycTierLimitField({ field: 'maxPayoutAttempts', value: parseInt(e.target.value) || 3 }))}
                />
                <PillSelect
                  label="Status"
                  options={boolOptions}
                  value={updateForm.data.isActive !== undefined ? String(updateForm.data.isActive) : 'true'}
                  onValueChange={(v) => dispatch(setUpdateKycTierLimitField({ field: 'isActive', value: v === 'true' }))}
                />
                <PillInput
                  label="BTC Confirmations"
                  type="number"
                  placeholder="1"
                  value={updateForm.data.requiredConfirmationsBTC ?? ''}
                  onChange={(e) => dispatch(setUpdateKycTierLimitField({ field: 'requiredConfirmationsBTC', value: parseInt(e.target.value) || 1 }))}
                />
                <PillInput
                  label="SOL Confirmations"
                  type="number"
                  placeholder="1"
                  value={updateForm.data.requiredConfirmationsSOL ?? ''}
                  onChange={(e) => dispatch(setUpdateKycTierLimitField({ field: 'requiredConfirmationsSOL', value: parseInt(e.target.value) || 1 }))}
                />
                <PillInput
                  label="TRC20 Confirmations"
                  type="number"
                  placeholder="1"
                  value={updateForm.data.requiredConfirmationsTRC20 ?? ''}
                  onChange={(e) => dispatch(setUpdateKycTierLimitField({ field: 'requiredConfirmationsTRC20', value: parseInt(e.target.value) || 1 }))}
                />
              </div>

              <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-[#F2F4F7]">
                <CustomButton
                  variant="button"
                  onClick={closeEditModal}
                  className="bg-white !text-[#03034D] border border-[#ECECEC] hover:bg-gray-50 px-8"
                  buttonText="Cancel"
                />
                <CustomButton
                  onClick={handleUpdate}
                  disabled={updateKycTierLimitMutation.isPending}
                  className="px-10"
                  buttonText={updateKycTierLimitMutation.isPending ? 'Saving...' : 'Save Changes'}
                />
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
            <div className="bg-white rounded-[32px] w-full max-w-md mx-4 p-8 shadow-2xl border border-[#ECECEC]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-[#03034D]">Delete Tier Limit</h3>
                <button
                  onClick={closeDeleteModal}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="flex items-start gap-3 bg-red-50 p-4 rounded-2xl mb-6">
                <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={18} />
                <p className="text-red-700 text-sm font-medium leading-relaxed">
                  Are you sure you want to delete this KYC tier limit? This action cannot be undone and will affect all users in this tier.
                </p>
              </div>
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={closeDeleteModal}
                  className="px-6 py-2.5 rounded-full border border-[#ECECEC] text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleteKycTierLimitMutation.isPending}
                  className="px-8 py-2.5 rounded-full bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-colors disabled:opacity-60 cursor-pointer shadow-lg shadow-red-200"
                >
                  {deleteKycTierLimitMutation.isPending ? 'Deleting...' : 'Delete Permanently'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  );
};

export default KycTierLimits;
