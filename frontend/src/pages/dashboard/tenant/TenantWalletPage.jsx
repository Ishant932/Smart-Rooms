import { useEffect, useState } from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import WalletPanel from '../../../components/WalletPanel';
import { getWallet } from '../../../api/client';

export default function TenantWalletPage() {
  const [data, setData] = useState(null);

  useEffect(() => { getWallet().then(setData); }, []);

  return (
    <DashboardLayout role="tenant" title="Wallet & Points">
      <WalletPanel walletData={data} onUpdate={(d) => setData((prev) => ({ ...prev, wallet: d.wallet }))} />
      <div className="mt-6 rounded-2xl border border-brand-200 bg-brand-50 p-5">
        <h3 className="font-bold text-brand-800">How it works</h3>
        <ul className="mt-3 space-y-2 text-sm text-brand-700">
          <li>• Register → get <strong>80 welcome points</strong></li>
          <li>• Refer a friend → earn cash when they join SmartRoooms</li>
          <li>• <strong>500 points</strong> = ₹50 rent credit (added to wallet)</li>
          <li>• Pay rent using wallet balance directly</li>
          <li>• Play games & stay active → earn more reward points</li>
        </ul>
      </div>
    </DashboardLayout>
  );
}
