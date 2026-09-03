// apps/mobile/src/features/activity/shareReceipt.ts
import { Share, Linking } from 'react-native';
import type { Transaction } from '@/features/activity/stores/transactions.store';

const gbp = (m: number) => `£${(m / 100).toLocaleString('en-GB', { minimumFractionDigits: 2 })}`;

export function receiptText(t: Transaction): string {
  const when = new Date(t.createdAt).toLocaleString('en-GB');
  const lines = [
    'Social Remit — Receipt',
    '',
    t.type === 'topup' ? 'Wallet top-up' : 'Money sent',
    `Amount: ${t.type === 'topup' ? '+' : '−'}${gbp(t.amountMinor)}`,
  ];
  if (t.type === 'send') {
    lines.push(`To: ${t.recipientName ?? '—'}`);
    if (t.corridorCountry) lines.push(`Destination: ${t.corridorCountry}`);
    if (t.receiveLabel) lines.push(`They receive: ${t.receiveLabel}`);
    if (t.method) lines.push(`Paid with: ${t.method}`);
    if (t.reference) lines.push(`Reference: ${t.reference}`);
  } else if (t.method) {
    lines.push(`Method: ${t.method}`);
  }
  lines.push(`Status: ${t.status}`, `Date: ${when}`, `Transaction ID: ${t.id}`);
  return lines.join('\n');
}

/** Opens the OS share sheet — includes WhatsApp, Messages, Mail, and Print/Save-as-PDF. */
export async function shareReceipt(t: Transaction) {
  try {
    await Share.share({ message: receiptText(t), title: 'Social Remit receipt' });
  } catch {
    /* dismissed */
  }
}

export function shareWhatsApp(t: Transaction) {
  const text = encodeURIComponent(receiptText(t));
  Linking.openURL(`whatsapp://send?text=${text}`).catch(() =>
    Linking.openURL(`https://wa.me/?text=${text}`),
  );
}

export function shareMessage(t: Transaction) {
  const text = encodeURIComponent(receiptText(t));
  Linking.openURL(`sms:?body=${text}`).catch(() => {
    /* no SMS app */
  });
}
