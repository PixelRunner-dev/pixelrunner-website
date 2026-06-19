// ponytail: mocked webshop list — real resellers unknown. Replace `url` when known.
export interface Shop {
  name: string;
  country: string;
  url: string;
}

export const shops: Shop[] = [
  { name: 'Bitcoin Store NL', country: 'Netherlands', url: 'https://example.com/bitcoinstore-nl' },
  { name: 'Sats Shop EU', country: 'Europe', url: 'https://example.com/satsshop-eu' },
  { name: '21 Hardware', country: 'Germany', url: 'https://example.com/21-hardware' },
  { name: 'Orange Pill Gadgets', country: 'Belgium', url: 'https://example.com/orange-pill' }
];
