import { useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import AuthenticatedLayout from '../layout/AuthenticatedLayout';
import PageHeader from '../components/global/pageHeader';
import { PillInput } from '../components/ui/input';
import { PillSelect } from '../components/ui/select';
import { useCurrencyQuery } from '../queries/currency.querries';
import type { SupportedCurrencyResponsePayload } from '../types/response.payload.types';
import CustomButton from '../components/global/Button';

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
      <div className="p-6 mx-auto">
        <PageHeader 
          title="Supported Currencies" 
          actions={
            <CustomButton
              onClick={openCreateModal}
              className="flex items-center gap-2"
            >
              <Plus size={18} />
              Add Currency
            </CustomButton>
          }
        />

        {/* Heading row */}
        <div className="flex mt-8 w-full items-center justify-between mb-8">
          <h2 className="text-[24px] font-bold text-[#03034D]">
            System Currencies
            {currencies && (
              <span className="ml-3 text-base text-gray-400 font-medium">
                ({currencies.length})
              </span>
            )}
          </h2>
        </div>

        {/* Grid */}
        {loadingCurrencies ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-[#575AE5] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {!currencies || currencies.length === 0 ? (
              <div className="col-span-full rounded-3xl border border-dashed border-[#ECECEC] bg-white p-12 text-center text-gray-400">
                No currencies configured yet. Click "+ Add Currency" to create one.
              </div>
            ) : (
              currencies.map((currency) => (
                <div
                  key={currency.id}
                  className="rounded-[32px] border border-[#ECECEC] bg-white p-6 flex flex-col gap-5 hover:border-[#575AE5] transition-all group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      {currency.logoUrl ? (
                        <img
                          src={currency.logoUrl}
                          alt={currency.name}
                          className="w-12 h-12 rounded-2xl object-cover border border-[#ECECEC]"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-2xl bg-[#F5F5FF] flex items-center justify-center text-[#03034D] font-bold text-lg">
                          {currency.code.slice(0, 2)}
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-[#03034D] leading-tight">{currency.name}</p>
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mt-0.5">{currency.code}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        currency.isActive
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${currency.isActive ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                      {currency.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  {currency.description && (
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{currency.description}</p>
                  )}

                  <div className="flex items-center justify-end gap-1 border-t border-[#F2F4F7] pt-4 mt-auto">
                    <button
                      onClick={() => openEditModal(currency)}
                      className="p-2 rounded-xl text-gray-400 hover:text-[#575AE5] hover:bg-[#F5F5FF] transition-all"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => openDeleteModal(currency)}
                      className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                    >
                      <Trash2 size={16} />
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
            <p className="text-gray-600 text-sm leading-relaxed">
              Are you sure you want to delete <strong>{deleteTarget.name}</strong> ({deleteTarget.code})? This action cannot be undone and will affect system-wide exchange rates.
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
    <div className="grid grid-cols-1 gap-1">
      <PillInput
        label="Currency Name"
        placeholder="e.g. Nigerian Naira"
        value={name}
        onChange={(e) => onChange('name', e.target.value)}
      />
      <PillInput
        label="Currency Code"
        placeholder="e.g. NGN"
        maxLength={3}
        value={code}
        onChange={(e) => onChange('code', e.target.value.toUpperCase())}
      />
      <PillInput
        label="Description (optional)"
        placeholder="Short description"
        value={description}
        onChange={(e) => onChange('description', e.target.value)}
      />
      <PillInput
        label="Logo URL (optional)"
        placeholder="https://..."
        value={logoUrl}
        onChange={(e) => onChange('logoUrl', e.target.value)}
      />
      <PillSelect
        label="Status"
        options={boolOptions}
        value={String(isActive)}
        onValueChange={(v) => onChange('isActive', v === 'true')}
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
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
      <div className="bg-white rounded-[32px] w-full max-w-lg mx-4 p-8 max-h-[90vh] overflow-y-auto shadow-2xl border border-[#ECECEC]">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-[22px] font-bold text-[#03034D]">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {children}

        <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-[#F2F4F7]">
          <CustomButton
            variant="button"
            onClick={onClose}
            className="bg-white !text-[#03034D] border border-[#ECECEC] hover:bg-gray-50 px-8"
            buttonText="Cancel"
          />
          <CustomButton
            onClick={onConfirm}
            disabled={confirmDisabled}
            className={confirmDestructive ? 'bg-red-500 hover:bg-red-600 px-10' : 'px-10'}
            buttonText={confirmLabel}
          />
        </div>
      </div>
    </div>
  );
}
