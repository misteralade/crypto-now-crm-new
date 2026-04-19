import { useState } from 'react';
import { useSweepQuery } from '../../../queries/sweep.querries.ts';
import { toast } from 'react-toastify';
import LabeledPillSelect from '../../global/LabeledPillSelect.tsx';
import Button from '../../global/Button.tsx';
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

const CRYPTO_OPTIONS = [
  { label: 'Bitcoin (BTC)', value: 'btc' },
  { label: 'USDT', value: 'usdt' },
  { label: 'USDC', value: 'usdc' },
  { label: 'Solana (SOL)', value: 'sol' },
];

export default function SweepConfigModal({ open, onClose }: SweepConfigModalProps) {
  const navigate = useNavigate();
  const { useSweepPreview, initiateSweepMutation } = useSweepQuery();

  const [network, setNetwork] = useState('');
  const [cryptocurrencyId, setCryptocurrencyId] = useState('');
  const [isPreviewing, setIsPreviewing] = useState(false);

  // When both network and crypto selected, show preview
  const { data: previewData, isLoading: isPreviewLoading, error: previewError } = useSweepPreview(
    isPreviewing && network && cryptocurrencyId ? { network, cryptocurrencyId } : null
  );

  if (!open) return null;

  const handlePreview = () => {
    if (!network || !cryptocurrencyId) {
      toast.error('Please select both network and cryptocurrency');
      return;
    }
    setIsPreviewing(true);
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
        } as any);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to initiate sweep');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[--color-border] flex items-center justify-between">
          <h2 className="text-lg font-bold text-[--color-text-primary]">Initiate Sweep</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <LabeledPillSelect
              label="Select Network"
              value={network}
              onValueChange={(val) => {
                setNetwork(val);
                setIsPreviewing(false);
              }}
              options={NETWORK_OPTIONS}
            />

            <LabeledPillSelect
              label="Select Cryptocurrency"
              value={cryptocurrencyId}
              onValueChange={(val) => {
                setCryptocurrencyId(val);
                setIsPreviewing(false);
              }}
              options={CRYPTO_OPTIONS}
            />
          </div>

          {isPreviewing && isPreviewLoading && (
            <div className="flex justify-center py-4">
              <LoadingSpinner />
            </div>
          )}

          {isPreviewing && previewData && (
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Wallets to sweep:</span>
                <span className="font-bold">{previewData.totalWallets}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Estimated Total:</span>
                <span className="font-bold">{previewData.estimatedAmount.toFixed(6)} {network}</span>
              </div>
              <div className="pt-2 border-t border-gray-200">
                <p className="text-[10px] text-gray-400 italic">
                  * Funds will be sent to admin wallet: {previewData.targetAdminWallet.address.slice(0, 10)}...
                </p>
              </div>
            </div>
          )}

          {previewError && (
            <div className="bg-red-50 p-3 rounded-lg border border-red-100 text-xs text-red-600">
              {previewError.message}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[--color-border] bg-gray-50 flex gap-3">
          <div className="flex-1">
            <Button
              variant="button"
              buttonText="Cancel"
              className="w-full !bg-white !text-[#03034D] border border-[#E4E7EC] hover:!bg-gray-50"
              onClick={onClose}
            />
          </div>
          {!isPreviewing || !previewData ? (
            <div className="flex-1">
              <Button
                variant="button"
                buttonText={isPreviewLoading ? "Loading..." : "Preview Sweep"}
                className="w-full"
                disabled={!network || !cryptocurrencyId || isPreviewLoading}
                onClick={handlePreview}
              />
            </div>
          ) : (
            <div className="flex-1">
              <Button
                variant="button"
                buttonText="Confirm & Start"
                className="w-full"
                disabled={initiateSweepMutation.isPending}
                onClick={handleInitiate}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
