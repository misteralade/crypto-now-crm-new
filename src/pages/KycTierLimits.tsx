import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { toast } from 'react-toastify';
import AuthenticatedLayout from '../layout/AuthenticatedLayout';
import PageHeader from '../components/global/pageHeader';
import MFLabeledPillInput from '../components/global/LabeledPillInput';
import MFLabeledPillSelect from '../components/global/LabeledPillSelect';
import { useKycQuery } from '../queries/kyc.querries';
import {
  setCreateKycTierLimitField,
  setUpdateKycTierLimitId,
  setUpdateKycTierLimitField,
  setUpdateKycTierLimit,
  setDeleteKycTierLimitId,
  clearCreateKycTierLimit,
  clearUpdateKycTierLimit,
  clearDeleteKycTierLimitId,
} from '../redux/kyc-tier-limit.slice';
import type { RootState } from '../store';
import type { KycTierLimitResponsePayload } from '../types/response.payload.types';
import type { KycTierType } from '../schemas/kyc.schema';

const TIER_DISPLAY: Record<string, string> = {
  GUEST: 'Guest (Unverified)',
  VERIFIED: 'Verified (KYC passed)',
};

const TIERS: KycTierType[] = ['GUEST', 'VERIFIED'];

const tierOptions = [
  { value: 'GUEST', label: 'Guest — unverified users' },
  { value: 'VERIFIED', label: 'Verified — KYC-approved users' },
];

const boolOptions = [
  { value: 'true', label: 'Active' },
  { value: 'false', label: 'Inactive' },
];

const KycTierLimits = () => {
  const dispatch = useDispatch();

  const {
    // 🧩 Values
    kycTierLimits,
    loadingKycTierLimits,

    // ⚙️ Functions
    createKycTierLimitMutation,
    updateKycTierLimitMutation,
    deleteKycTierLimitMutation,
  } = useKycQuery();

  const createForm = useSelector((state: RootState) => state.kycTierLimit.create);
  const updateForm = useSelector((state: RootState) => state.kycTierLimit.update);
  const deleteState = useSelector((state: RootState) => state.kycTierLimit.delete);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const openCreateModal = () => {
    dispatch(clearCreateKycTierLimit());
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    dispatch(clearCreateKycTierLimit());
  };

  const openEditModal = (tierLimit: KycTierLimitResponsePayload) => {
    dispatch(setUpdateKycTierLimitId(tierLimit.id));
    dispatch(setUpdateKycTierLimit({
      kycTier: tierLimit.kycTier,
      currencyCode: tierLimit.currencyCode,
      minTransactionAmount: parseFloat(tierLimit.minTransactionAmount),
      maxTransactionAmount: parseFloat(tierLimit.maxTransactionAmount),
      dailyLimit: parseFloat(tierLimit.dailyLimit),
      monthlyLimit: parseFloat(tierLimit.monthlyLimit),
      maxPayoutAttempts: tierLimit.maxPayoutAttempts,
      requiredConfirmationsBTC: tierLimit.requiredConfirmationsBTC,
      requiredConfirmationsSOL: tierLimit.requiredConfirmationsSOL,
      requiredConfirmationsTRC20: tierLimit.requiredConfirmationsTRC20,
      isActive: tierLimit.isActive,
    }));
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    dispatch(clearUpdateKycTierLimit());
  };

  const openDeleteModal = (tierLimit: KycTierLimitResponsePayload) => {
    dispatch(setDeleteKycTierLimitId(tierLimit.id));
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    dispatch(clearDeleteKycTierLimitId());
  };

  const handleCreate = () => {
    if (!createForm.currencyCode) {
      toast.error('Currency code is required');
      return;
    }
    createKycTierLimitMutation.mutate(undefined, {
      onSuccess: () => {
        closeCreateModal();
      },
    });
  };

  const handleUpdate = () => {
    if (!updateForm.id) return;
    updateKycTierLimitMutation.mutate(undefined, {
      onSuccess: () => {
        closeEditModal();
      },
    });
  };

  const handleDelete = () => {
    if (!deleteState.id) return;
    deleteKycTierLimitMutation.mutate(undefined, {
      onSuccess: () => {
        closeDeleteModal();
      },
    });
  };

  const tiersByGroup = TIERS.reduce<Record<string, KycTierLimitResponsePayload[]>>(
    (acc, tier) => {
      acc[tier] = (kycTierLimits ?? []).filter((tl) => tl.kycTier === tier);
      return acc;
    },
    {} as Record<string, KycTierLimitResponsePayload[]>
  );

  return (
    <AuthenticatedLayout>
      <div className="p-6 min-h-screen container">
        <PageHeader title="KYC Tier Limits" />

        <div className="flex mt-8 w-full items-center justify-between mb-6">
          <p className="text-[24px] font-medium text-[#0E0F0C]">Tier Configuration</p>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-6 py-2 bg-[#03034D] text-white rounded-full hover:bg-opacity-90 transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Add Tier Limit
          </button>
        </div>

        {loadingKycTierLimits ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-[#03034D] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-8">
            {TIERS.map((tier) => (
              <section key={tier}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-4 py-1.5 rounded-full bg-[#03034D] text-white text-sm font-semibold">
                    {TIER_DISPLAY[tier]}
                  </span>
                  <span className="text-gray-400 text-sm">{tier}</span>
                  <span className="text-gray-400 text-sm">·</span>
                  <span className="text-gray-500 text-sm">{tiersByGroup[tier].length} entr{tiersByGroup[tier].length === 1 ? 'y' : 'ies'}</span>
                </div>

                {tiersByGroup[tier].length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-[#ECECEC] bg-white p-8 text-center text-gray-400 text-sm">
                    No limits configured for {TIER_DISPLAY[tier]}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {tiersByGroup[tier].map((tl) => (
                      <div
                        key={tl.id}
                        className="rounded-2xl border border-[#ECECEC] bg-white shadow-sm p-5 flex flex-col gap-4"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-lg font-semibold text-[#03034D]">{tl.currencyCode}</p>
                            <span
                              className={`inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-medium ${
                                tl.isActive
                                  ? 'bg-green-50 text-green-600'
                                  : 'bg-gray-100 text-gray-500'
                              }`}
                            >
                              {tl.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openEditModal(tl)}
                              className="p-2 rounded-full hover:bg-[#D3D4F8] transition-colors"
                              title="Edit"
                            >
                              <Pencil className="w-4 h-4 text-[#03034D]" />
                            </button>
                            <button
                              onClick={() => openDeleteModal(tl)}
                              className="p-2 rounded-full hover:bg-red-50 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="bg-[#F6F6F6] rounded-xl p-3">
                            <p className="text-gray-400 text-xs mb-0.5">Min Transaction</p>
                            <p className="font-semibold text-[#0E0F0C]">
                              {parseFloat(tl.minTransactionAmount).toLocaleString()}
                            </p>
                          </div>
                          <div className="bg-[#F6F6F6] rounded-xl p-3">
                            <p className="text-gray-400 text-xs mb-0.5">Max Transaction</p>
                            <p className="font-semibold text-[#0E0F0C]">
                              {parseFloat(tl.maxTransactionAmount).toLocaleString()}
                            </p>
                          </div>
                          <div className="bg-[#F6F6F6] rounded-xl p-3">
                            <p className="text-gray-400 text-xs mb-0.5">Daily Limit</p>
                            <p className="font-semibold text-[#0E0F0C]">
                              {parseFloat(tl.dailyLimit).toLocaleString()}
                            </p>
                          </div>
                          <div className="bg-[#F6F6F6] rounded-xl p-3">
                            <p className="text-gray-400 text-xs mb-0.5">Monthly Limit</p>
                            <p className="font-semibold text-[#0E0F0C]">
                              {parseFloat(tl.monthlyLimit).toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <div className="border-t border-[#F0F0F0] pt-3 grid grid-cols-3 gap-2 text-xs text-center">
                          <div>
                            <p className="text-gray-400">BTC Conf.</p>
                            <p className="font-semibold text-[#03034D]">{tl.requiredConfirmationsBTC}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">SOL Conf.</p>
                            <p className="font-semibold text-[#03034D]">{tl.requiredConfirmationsSOL}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">TRC20 Conf.</p>
                            <p className="font-semibold text-[#03034D]">{tl.requiredConfirmationsTRC20}</p>
                          </div>
                        </div>

                        <div className="text-xs text-gray-400">
                          Max payout attempts: <span className="text-[#0E0F0C] font-medium">{tl.maxPayoutAttempts}</span>
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-3xl w-full max-w-2xl mx-4 p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-[#03034D]">Add KYC Tier Limit</h3>
                <button
                  onClick={closeCreateModal}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MFLabeledPillSelect
                  label="KYC Tier"
                  options={tierOptions}
                  value={createForm.kycTier}
                  onChange={(e) => dispatch(setCreateKycTierLimitField({ field: 'kycTier', value: e.target.value as KycTierType }))}
                />
                <MFLabeledPillInput
                  label="Currency Code"
                  placeholder="e.g. NGN"
                  value={createForm.currencyCode}
                  onChange={(e) => dispatch(setCreateKycTierLimitField({ field: 'currencyCode', value: e.target.value.toUpperCase() }))}
                />
                <MFLabeledPillInput
                  label="Min Transaction Amount"
                  type="number"
                  placeholder="0"
                  value={createForm.minTransactionAmount}
                  onChange={(e) => dispatch(setCreateKycTierLimitField({ field: 'minTransactionAmount', value: parseFloat(e.target.value) || 0 }))}
                />
                <MFLabeledPillInput
                  label="Max Transaction Amount"
                  type="number"
                  placeholder="0"
                  value={createForm.maxTransactionAmount}
                  onChange={(e) => dispatch(setCreateKycTierLimitField({ field: 'maxTransactionAmount', value: parseFloat(e.target.value) || 0 }))}
                />
                <MFLabeledPillInput
                  label="Daily Limit"
                  type="number"
                  placeholder="0"
                  value={createForm.dailyLimit}
                  onChange={(e) => dispatch(setCreateKycTierLimitField({ field: 'dailyLimit', value: parseFloat(e.target.value) || 0 }))}
                />
                <MFLabeledPillInput
                  label="Monthly Limit"
                  type="number"
                  placeholder="0"
                  value={createForm.monthlyLimit}
                  onChange={(e) => dispatch(setCreateKycTierLimitField({ field: 'monthlyLimit', value: parseFloat(e.target.value) || 0 }))}
                />
                <MFLabeledPillInput
                  label="Max Payout Attempts"
                  type="number"
                  placeholder="3"
                  value={createForm.maxPayoutAttempts}
                  onChange={(e) => dispatch(setCreateKycTierLimitField({ field: 'maxPayoutAttempts', value: parseInt(e.target.value) || 3 }))}
                />
                <MFLabeledPillSelect
                  label="Status"
                  options={boolOptions}
                  value={String(createForm.isActive)}
                  onChange={(e) => dispatch(setCreateKycTierLimitField({ field: 'isActive', value: e.target.value === 'true' }))}
                />
                <MFLabeledPillInput
                  label="BTC Confirmations"
                  type="number"
                  placeholder="1"
                  value={createForm.requiredConfirmationsBTC}
                  onChange={(e) => dispatch(setCreateKycTierLimitField({ field: 'requiredConfirmationsBTC', value: parseInt(e.target.value) || 1 }))}
                />
                <MFLabeledPillInput
                  label="SOL Confirmations"
                  type="number"
                  placeholder="1"
                  value={createForm.requiredConfirmationsSOL}
                  onChange={(e) => dispatch(setCreateKycTierLimitField({ field: 'requiredConfirmationsSOL', value: parseInt(e.target.value) || 1 }))}
                />
                <MFLabeledPillInput
                  label="TRC20 Confirmations"
                  type="number"
                  placeholder="1"
                  value={createForm.requiredConfirmationsTRC20}
                  onChange={(e) => dispatch(setCreateKycTierLimitField({ field: 'requiredConfirmationsTRC20', value: parseInt(e.target.value) || 1 }))}
                />
              </div>

              <div className="flex items-center justify-end gap-3 mt-6">
                <button
                  onClick={closeCreateModal}
                  className="px-6 py-2.5 rounded-full border border-[#ECECEC] text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={createKycTierLimitMutation.isPending}
                  className="px-6 py-2.5 rounded-full bg-[#03034D] text-white text-sm font-medium hover:bg-opacity-90 transition-colors disabled:opacity-60"
                >
                  {createKycTierLimitMutation.isPending ? 'Creating...' : 'Create Tier Limit'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-3xl w-full max-w-2xl mx-4 p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-[#03034D]">Edit KYC Tier Limit</h3>
                <button
                  onClick={closeEditModal}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MFLabeledPillSelect
                  label="KYC Tier"
                  options={tierOptions}
                  value={updateForm.data.kycTier ?? ''}
                  onChange={(e) => dispatch(setUpdateKycTierLimitField({ field: 'kycTier', value: e.target.value as KycTierType }))}
                />
                <MFLabeledPillInput
                  label="Currency Code"
                  placeholder="e.g. NGN"
                  value={updateForm.data.currencyCode ?? ''}
                  onChange={(e) => dispatch(setUpdateKycTierLimitField({ field: 'currencyCode', value: e.target.value.toUpperCase() }))}
                />
                <MFLabeledPillInput
                  label="Min Transaction Amount"
                  type="number"
                  placeholder="0"
                  value={updateForm.data.minTransactionAmount ?? ''}
                  onChange={(e) => dispatch(setUpdateKycTierLimitField({ field: 'minTransactionAmount', value: parseFloat(e.target.value) || 0 }))}
                />
                <MFLabeledPillInput
                  label="Max Transaction Amount"
                  type="number"
                  placeholder="0"
                  value={updateForm.data.maxTransactionAmount ?? ''}
                  onChange={(e) => dispatch(setUpdateKycTierLimitField({ field: 'maxTransactionAmount', value: parseFloat(e.target.value) || 0 }))}
                />
                <MFLabeledPillInput
                  label="Daily Limit"
                  type="number"
                  placeholder="0"
                  value={updateForm.data.dailyLimit ?? ''}
                  onChange={(e) => dispatch(setUpdateKycTierLimitField({ field: 'dailyLimit', value: parseFloat(e.target.value) || 0 }))}
                />
                <MFLabeledPillInput
                  label="Monthly Limit"
                  type="number"
                  placeholder="0"
                  value={updateForm.data.monthlyLimit ?? ''}
                  onChange={(e) => dispatch(setUpdateKycTierLimitField({ field: 'monthlyLimit', value: parseFloat(e.target.value) || 0 }))}
                />
                <MFLabeledPillInput
                  label="Max Payout Attempts"
                  type="number"
                  placeholder="3"
                  value={updateForm.data.maxPayoutAttempts ?? ''}
                  onChange={(e) => dispatch(setUpdateKycTierLimitField({ field: 'maxPayoutAttempts', value: parseInt(e.target.value) || 3 }))}
                />
                <MFLabeledPillSelect
                  label="Status"
                  options={boolOptions}
                  value={updateForm.data.isActive !== undefined ? String(updateForm.data.isActive) : 'true'}
                  onChange={(e) => dispatch(setUpdateKycTierLimitField({ field: 'isActive', value: e.target.value === 'true' }))}
                />
                <MFLabeledPillInput
                  label="BTC Confirmations"
                  type="number"
                  placeholder="1"
                  value={updateForm.data.requiredConfirmationsBTC ?? ''}
                  onChange={(e) => dispatch(setUpdateKycTierLimitField({ field: 'requiredConfirmationsBTC', value: parseInt(e.target.value) || 1 }))}
                />
                <MFLabeledPillInput
                  label="SOL Confirmations"
                  type="number"
                  placeholder="1"
                  value={updateForm.data.requiredConfirmationsSOL ?? ''}
                  onChange={(e) => dispatch(setUpdateKycTierLimitField({ field: 'requiredConfirmationsSOL', value: parseInt(e.target.value) || 1 }))}
                />
                <MFLabeledPillInput
                  label="TRC20 Confirmations"
                  type="number"
                  placeholder="1"
                  value={updateForm.data.requiredConfirmationsTRC20 ?? ''}
                  onChange={(e) => dispatch(setUpdateKycTierLimitField({ field: 'requiredConfirmationsTRC20', value: parseInt(e.target.value) || 1 }))}
                />
              </div>

              <div className="flex items-center justify-end gap-3 mt-6">
                <button
                  onClick={closeEditModal}
                  className="px-6 py-2.5 rounded-full border border-[#ECECEC] text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  disabled={updateKycTierLimitMutation.isPending}
                  className="px-6 py-2.5 rounded-full bg-[#03034D] text-white text-sm font-medium hover:bg-opacity-90 transition-colors disabled:opacity-60"
                >
                  {updateKycTierLimitMutation.isPending ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-3xl w-full max-w-md mx-4 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[#03034D]">Delete Tier Limit</h3>
                <button
                  onClick={closeDeleteModal}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <p className="text-gray-600 text-sm mb-6">
                Are you sure you want to delete this KYC tier limit? This action cannot be undone.
              </p>
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={closeDeleteModal}
                  className="px-6 py-2.5 rounded-full border border-[#ECECEC] text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleteKycTierLimitMutation.isPending}
                  className="px-6 py-2.5 rounded-full bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-60"
                >
                  {deleteKycTierLimitMutation.isPending ? 'Deleting...' : 'Delete'}
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
