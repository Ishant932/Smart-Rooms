import { useEffect, useState } from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import WalletPanel from '../../../components/WalletPanel';
import { getWallet } from '../../../api/client';

export default function OwnerWalletPage() {
  const [data, setData] = useState(null);
  useEffect(() => { getWallet().then(setData); }, []);
  return (
    <DashboardLayout role="owner" title="Wallet & Points">
      <WalletPanel walletData={data} onUpdate={(d) => setData((p) => ({ ...p, wallet: d.wallet }))} />
    </DashboardLayout>
  );
}
