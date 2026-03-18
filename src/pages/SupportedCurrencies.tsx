import { useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import AuthenticatedLayout from '../layout/AuthenticatedLayout';
import PageHeader from '../components/global/pageHeader';
import MFLabeledPillInput from '../components/global/LabeledPillInput';
import MFLabeledPillSelect from '../components/global/LabeledPillSelect';
import { useCurrencyQuery } from '../queries/currency.querries';
import type { SupportedCurrencyResponsePayload } from '../types/response.payload.types';

// ─── Types ───────────────────────────────────────────────────────────────────

type CreateForm = {
  name: string;
  code: string;
  description: string;
  logoUrl: string;
  isActive: boolean;
};

type EditForm = {
  id: string;
  name: string;
  code: string;
  description: string;
  logoUrl: string;
  isActive: boolean;
};

const EMPTY_CREATE: CreateForm = {
  name: '',
  code: '',
  description: '',
  logoUrl: '',
  isActive: true,
};

const boolOptions = [
  { value: 'true', label: 'Active' },
  { value: 'false', label: 'Inactive' },
];

// ─── Component ───────────────────────────────────────────────────────────────

const SupportedCurrencies = () => {
  const {
    // 🧩 Values
    currencies,
    loadingCurrencies,

    // ⚙️ Functions
    createCurrencyMutation,
    updateCurrencyMutation,
    deleteCurrencyMutation,
  } = useCurrencyQuery();

  // Local form state — no Redux, no persistence issues
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState<CreateForm>(EMPTY_CREATE);
  const [editForm, setEditForm] = useState<EditForm | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SupportedCurrencyResponsePayload | null>(null);

  // ─── Create ─────────────────────────────────────────────────────────────

  const openCreateModal = () => { setCreateForm(EMPTY_CREATE); setIsCreateModalOpen(true); };
  const closeCreateModal = () => { setIsCreateModalOpen(false); setCreateForm(EMPTY_CREATE); };

  const handleCreate = () => {
    createCurrencyMutation.mutate(
      {
        name: createForm.name,
        code: createForm.code,
        description: createForm.description || undefined,
        logoUrl: createForm.logoUrl || undefined,
        isActive: createForm.isActive,
      },
      { onSuccess: closeCreateModal }
    );
  };

  // ─── Edit ────────────────────────────────────────────────────────────────

  const openEditModal = (currency: SupportedCurrencyResponsePayload) => {
    setEditForm({
      id: currency.id,
      name: currency.name,
      code: currency.code,
      description: currency.description ?? '',
      logoUrl: currency.logoUrl ?? '',
      isActive: currency.isActive,
    });
  };

  const closeEditModal = () => setEditForm(null);

  const handleUpdate = () => {
    if (!editForm) return;
    updateCurrencyMutation.mutate(
      {
        id: editForm.id,
        payload: {
          name: editForm.name,
          code: editForm.code,
          description: editForm.description || undefined,
          logoUrl: editForm.logoUrl || undefined,
          isActive: editForm.isActive,
        },
      },
      { onSuccess: closeEditModal }
    );
  };

  // ─── Delete ──────────────────────────────────────────────────────────────

  const openDeleteModal = (currency: SupportedCurrencyResponsePayload) => setDeleteTarget(currency);
  const closeDeleteModal = () => setDeleteTarget(null);

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteCurrencyMutation.mutate(deleteTarget.id, { onSuccess: closeDeleteModal });
  };

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <AuthenticatedLayout>
      <div className="p-6 min-h-screen container">
        <PageHeader title="Supported Currencies" />

        {/* Heading row */}
        <div className="flex mt-8 w-full items-center justify-between mb-6">
          <p className="text-[24px] font-medium text-[#0E0F0C]">
            Currencies
            {currencies && (
              <span className="ml-2 text-base text-gray-400 font-normal">
                ({currencies.length})
              </span>
            )}
          </p>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-6 py-2 bg-[#03034D] text-white rounded-full hover:bg-opacity-90 transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Add Currency
          </button>
        </div>

        {/* Grid */}
        {loadingCurrencies ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-[#03034D] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {!currencies || currencies.length === 0 ? (
              <div className="col-span-full rounded-2xl border border-dashed border-[#ECECEC] bg-white p-12 text-center text-gray-400 text-sm">
                No currencies configured yet. Click "+ Add Currency" to create one.
              </div>
            ) : (
              currencies.map((currency) => (
                <div
                  key={currency.id}
                  className="rounded-2xl border border-[#ECECEC] bg-white shadow-sm p-5 flex flex-col gap-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {currency.logoUrl ? (
                        <img
                          src={currency.logoUrl}
                          alt={currency.name}
                          className="w-10 h-10 rounded-full object-cover border border-[#ECECEC]"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-[#D3D4F8] flex items-center justify-center text-[#03034D] font-bold text-sm">
                          {currency.code.slice(0, 2)}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-[#0E0F0C] leading-tight">{currency.name}</p>
                        <p className="text-xs text-gray-400">{currency.code}</p>
                      </div>
                    </div>
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        currency.isActive
                          ? 'bg-green-50 text-green-600'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {currency.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  {currency.description && (
                    <p className="text-xs text-gray-500 line-clamp-2">{currency.description}</p>
                  )}

                  <div className="flex items-center justify-end gap-2 border-t border-[#F0F0F0] pt-3 mt-auto">
                    <button
                      onClick={() => openEditModal(currency)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-[#D3D4F8] transition-colors text-xs font-medium text-[#03034D]"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      Edit
                    </button>
                    <button
                      onClick={() => openDeleteModal(currency)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-red-50 transition-colors text-xs font-medium text-red-500"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── Create Modal ─────────────────────────────────────────────────── */}
        {isCreateModalOpen && (
          <Modal
            title="Add Currency"
            onClose={closeCreateModal}
            onConfirm={handleCreate}
            confirmLabel={createCurrencyMutation.isPending ? 'Creating...' : 'Create Currency'}
            confirmDisabled={createCurrencyMutation.isPending}
          >
            <CurrencyForm
              name={createForm.name}
              code={createForm.code}
              description={createForm.description}
              logoUrl={createForm.logoUrl}
              isActive={createForm.isActive}
              onChange={(field, value) => setCreateForm((prev) => ({ ...prev, [field]: value }))}
            />
          </Modal>
        )}

        {/* ── Edit Modal ───────────────────────────────────────────────────── */}
        {editForm && (
          <Modal
            title={`Edit ${editForm.name}`}
            onClose={closeEditModal}
            onConfirm={handleUpdate}
            confirmLabel={updateCurrencyMutation.isPending ? 'Saving...' : 'Save Changes'}
            confirmDisabled={updateCurrencyMutation.isPending}
          >
            <CurrencyForm
              name={editForm.name}
              code={editForm.code}
              description={editForm.description}
              logoUrl={editForm.logoUrl}
              isActive={editForm.isActive}
              onChange={(field, value) =>
                setEditForm((prev) => (prev ? { ...prev, [field]: value } : prev))
              }
            />
          </Modal>
        )}

        {/* ── Delete Modal ─────────────────────────────────────────────────── */}
        {deleteTarget && (
          <Modal
            title="Delete Currency"
            onClose={closeDeleteModal}
            onConfirm={handleDelete}
            confirmLabel={deleteCurrencyMutation.isPending ? 'Deleting...' : 'Delete'}
            confirmDisabled={deleteCurrencyMutation.isPending}
            confirmDestructive
          >
            <p className="text-gray-600 text-sm">
              Are you sure you want to delete <strong>{deleteTarget.name}</strong> ({deleteTarget.code})? This action cannot be undone.
            </p>
          </Modal>
        )}
      </div>
    </AuthenticatedLayout>
  );
};

export default SupportedCurrencies;

// ─── CurrencyForm ─────────────────────────────────────────────────────────────

type CurrencyFormProps = {
  name: string;
  code: string;
  description: string;
  logoUrl: string;
  isActive: boolean;
  onChange: (field: 'name' | 'code' | 'description' | 'logoUrl' | 'isActive', value: any) => void;
};

function CurrencyForm({ name, code, description, logoUrl, isActive, onChange }: CurrencyFormProps) {
  return (
    <div className="flex flex-col gap-4">
      <MFLabeledPillInput
        label="Currency Name"
        placeholder="e.g. Nigerian Naira"
        value={name}
        onChange={(e) => onChange('name', e.target.value)}
      />
      <MFLabeledPillInput
        label="Currency Code"
        placeholder="e.g. NGN"
        maxLength={3}
        value={code}
        onChange={(e) => onChange('code', e.target.value.toUpperCase())}
      />
      <MFLabeledPillInput
        label="Description (optional)"
        placeholder="Short description"
        value={description}
        onChange={(e) => onChange('description', e.target.value)}
      />
      <MFLabeledPillInput
        label="Logo URL (optional)"
        placeholder="https://..."
        value={logoUrl}
        onChange={(e) => onChange('logoUrl', e.target.value)}
      />
      <MFLabeledPillSelect
        label="Status"
        options={boolOptions}
        value={String(isActive)}
        onChange={(e) => onChange('isActive', e.target.value === 'true')}
      />
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────

type ModalProps = {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  onConfirm: () => void;
  confirmLabel: string;
  confirmDisabled?: boolean;
  confirmDestructive?: boolean;
};

function Modal({ title, children, onClose, onConfirm, confirmLabel, confirmDisabled, confirmDestructive }: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-3xl w-full max-w-lg mx-4 p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-[#03034D]">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {children}

        <div className="flex items-center justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full border border-[#ECECEC] text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={confirmDisabled}
            className={`px-6 py-2.5 rounded-full text-white text-sm font-medium transition-colors disabled:opacity-60 ${
              confirmDestructive
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-[#03034D] hover:bg-opacity-90'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
