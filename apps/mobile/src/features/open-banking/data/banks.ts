// apps/mobile/src/features/open-banking/data/banks.ts
export interface Bank {
  id: string;
  name: string;
  initials: string;
  color: string;
  popular?: boolean;
}

export const banks: Bank[] = [
  { id: 'barclays', name: 'Barclays', initials: 'BA', color: '#00AEEF', popular: true },
  { id: 'lloyds', name: 'Lloyds', initials: 'LL', color: '#024731', popular: true },
  { id: 'natwest', name: 'NatWest', initials: 'NW', color: '#5A287D', popular: true },
  { id: 'hsbc', name: 'HSBC', initials: 'HS', color: '#DB0011', popular: true },
  { id: 'santander', name: 'Santander', initials: 'SA', color: '#EC0000', popular: true },
  { id: 'monzo', name: 'Monzo', initials: 'MZ', color: '#FF3464', popular: true },
  { id: 'starling', name: 'Starling', initials: 'ST', color: '#6935D3', popular: true },
  { id: 'aib', name: 'Allied Irish Bank', initials: 'AI', color: '#131F6B' },
  { id: 'boi', name: 'Bank of Ireland', initials: 'BI', color: '#2D7D46' },
  { id: 'bos', name: 'Bank of Scotland', initials: 'BS', color: '#0F4C9A' },
  { id: 'chase', name: 'Chase UK', initials: 'CH', color: '#117ACA' },
  { id: 'coop', name: 'Co-operative Bank', initials: 'CO', color: '#00833E' },
  { id: 'firstdirect', name: 'First Direct', initials: 'FD', color: '#111111' },
  { id: 'halifax', name: 'Halifax', initials: 'HA', color: '#005EB8' },
  { id: 'nationwide', name: 'Nationwide', initials: 'NA', color: '#1B3A6B' },
  { id: 'revolut', name: 'Revolut', initials: 'RE', color: '#191C1F' },
  { id: 'tsb', name: 'TSB', initials: 'TS', color: '#1D3C85' },
  { id: 'virgin', name: 'Virgin Money', initials: 'VM', color: '#E10098' },
];

export const gbp = (minor: number) =>
  `£${(minor / 100).toLocaleString('en-GB', { minimumFractionDigits: 2 })}`;
