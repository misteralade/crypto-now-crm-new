import type { DisputeRow } from '../routes/disputes/DisputeTable';

export const disputes: Array<DisputeRow> = [
  {
    id: '001',
    user: 'Taiwo Joel',
    transactionId: 'TXN12345',
    amount: '#200,000',
    date: 'Aug 22, 2025 – 10:45',
    status: 'Open',
  },
  {
    id: '002',
    user: 'Akinapa Ajao',
    transactionId: 'TXN12775',
    amount: '#200,000',
    date: 'Aug 22, 2025 – 10:45',
    status: 'Under review',
  },
  {
    id: '003',
    user: 'John Sandra',
    transactionId: 'TXN15568',
    amount: '#200,000',
    date: 'Aug 22, 2025 – 10:45',
    status: 'Inactive',
  },
  {
    id: '004',
    user: 'Phoebe Badmus',
    transactionId: 'TXN76545',
    amount: '#200,000',
    date: 'Aug 22, 2025 – 10:45',
    status: 'Resolved',
  },
];
