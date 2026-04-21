import { useMemo, useState } from 'react';
import { useSweepQuery } from '../../../queries/sweep.querries.ts';
import { useCryptoQuery } from '../../../queries/crypto.querries.ts';
import { toast } from 'react-toastify';
import LabeledPillSelect from '../../global/LabeledPillSelect.tsx';
import { useNavigate } from '@tanstack/react-router';
import { LoadingSpinner } from '../../global/LoadingSpinner.tsx';

interface SweepConfigModalProps {
  open: boolean;
  onClose: () => void;
}

const NETWORK_OPTIONS = [
  { label: 'Bitcoin', value: 'BTC' },
  { label: 'Solana', value: 'SOLANA' },
  { label: 'Tron (TRC-20)', value: 'TRC20' },
  { label: 'Ethereum (ERC-20)', value: 'ERC20' },
];

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) return error.message;
  return 'Failed to initiate sweep';
}

export default function SweepConfigModal({ open, onClose }: SweepConfigModalProps) {
  const navigate = useNavigate();
  const { useSweepPreview, initiateSweepMutation } = useSweepQuery();
  const { allSupportedCrypto } = useCryptoQuery();

  const [network, setNetwork] = useState('');
  const [cryptocurrencyId, setCryptocurrencyId] = useState('');
  const [previewRequested, setPreviewRequested] = useState(false);

  const cryptoOptions = useMemo(() => {
    if (!allSupportedCrypto || !network) return [];
    return allSupportedCrypto
      .filter((crypto) => crypto.isActive && crypto.networks.includes(network))
      .map((crypto) => ({
        value: crypto.id,
        label: `${crypto.name} (${crypto.symbol.toUpperCase()})`,
      }));
  }, [allSupportedCrypto, network]);

  const selectedCrypto = useMemo(
    () => allSupportedCrypto?.find((crypto) => crypto.id === cryptocurrencyId),
    [allSupportedCrypto, cryptocurrencyId],
  );

  const canPreview = Boolean(network && cryptocurrencyId);
  const showPreview = previewRequested && canPreview;

  // When both network and crypto selected, show preview
  const { data: previewData, isLoading: isPreviewLoading, error: previewError } = useSweepPreview(
    showPreview ? { network, cryptocurrencyId } : null
  );

  if (!open) return null;

  const handlePreview = () => {
    if (!network || !cryptocurrencyId) {
      toast.error('Please select both network and cryptocurrency');
      return;
    }
    setPreviewRequested(true);
  };

  const handleInitiate = async () => {
    try {
      const result = await initiateSweepMutation.mutateAsync({
        network,
        cryptocurrencyId,
      });

      if (result.success && result.data?.sweepId) {
        toast.success('Sweep initiated successfully');
        onClose();
        void navigate({
          to: '/dashboard/treasury/$sweepId',
          params: { sweepId: result.data.sweepId }
        });
      } else {
        toast.error(result.message || 'Sweep request was not accepted');
      }
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    }
  };

  const resetPreviewAndSetNetwork = (value: string) => {
    setNetwork(value);
    setCryptocurrencyId('');
    setPreviewRequested(false);
  };

  const resetPreviewAndSetCrypto = (value: string) => {
    setCryptocurrencyId(value);
    setPreviewRequested(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-modal-backdrop-in">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-[#E4E7EC] bg-white shadow-2xl animate-modal-content-in">
        <div className="flex items-center justify-between border-b border-[--color-border] px-6 py-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#667085]">Step-by-step flow</p>
            <h2 className="text-lg font-semibold text-[--color-text-primary]">Initiate Treasury Sweep</h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 transition-colors hover:bg-gray-100">
            <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-5 p-6">
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-[--color-bg-light] p-2">
            <div className={`rounded-lg px-3 py-2 text-xs font-semibold ${!previewRequested ? 'bg-white text-[#03034D] shadow-sm' : 'text-[#667085]'}`}>
              1. Configure
            </div>
            <div className={`rounded-lg px-3 py-2 text-xs font-semibold ${previewRequested ? 'bg-white text-[#03034D] shadow-sm' : 'text-[#667085]'}`}>
              2. Review & Confirm
            </div>
          </div>

          <div className="space-y-4">
            <LabeledPillSelect
              label="Select Network"
              value={network}
              onValueChange={resetPreviewAndSetNetwork}
              options={NETWORK_OPTIONS}
            />

            <LabeledPillSelect
              label="Select Cryptocurrency"
              value={cryptocurrencyId}
              onValueChange={resetPreviewAndSetCrypto}
              options={cryptoOptions}
              disabled={!network || cryptoOptions.length === 0}
            />
          </div>

          {showPreview && isPreviewLoading && (
            <div className="flex justify-center py-4">
              <LoadingSpinner />
            </div>
          )}

          {showPreview && previewData && (
            <div className="space-y-3 rounded-xl border border-[#DDE0FF] bg-gradient-to-br from-[#F8F8FF] to-white p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#667085]">Wallets eligible</span>
                <span className="font-semibold text-[--color-text-primary]">{previewData.totalWallets}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#667085]">Estimated amount</span>
                <span className="font-semibold text-[--color-text-primary]">
                  {previewData.estimatedAmount.toFixed(6)} {selectedCrypto?.symbol.toUpperCase() ?? ''}
                </span>
              </div>
              <div className="border-t border-[#ECEFFD] pt-2">
                <p className="text-xs text-[#667085]">Destination wallet</p>
                <p className="mt-1 break-all font-mono text-[11px] text-[#03034D]">
                  {previewData.targetAdminWallet.address}
                </p>
              </div>
            </div>
          )}

          {previewError && (
            <div className="rounded-lg border border-red-100 bg-red-50 p-3 text-xs text-red-600">
              {previewError.message}
            </div>
          )}
        </div>

        <div className="flex gap-3 border-t border-[--color-border] bg-[#FBFBFF] px-6 py-4">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-[#E4E7EC] bg-white px-4 py-2.5 text-sm font-semibold text-[#03034D] transition-colors hover:bg-[#F8F8FF]"
          >
            Cancel
          </button>
          {!showPreview || !previewData ? (
            <button
              onClick={handlePreview}
              disabled={!canPreview || isPreviewLoading}
              className="flex-1 rounded-xl bg-[#03034D] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#050568] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPreviewLoading ? 'Loading Preview...' : 'Preview Sweep'}
            </button>
          ) : (
            <button
              onClick={handleInitiate}
              disabled={initiateSweepMutation.isPending}
              className="flex-1 rounded-xl bg-[#03034D] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#050568] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {initiateSweepMutation.isPending ? 'Starting...' : 'Confirm & Start'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
