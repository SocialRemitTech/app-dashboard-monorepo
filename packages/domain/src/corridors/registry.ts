import type { Corridor, DeliveryType } from '@sr/api-contract';

/** Pure helpers over corridor config. The config itself is fetched (server-owned), never hardcoded. */
export function supportsDelivery(corridor: Corridor, type: DeliveryType): boolean {
  return corridor.deliveryMethods.some((m) => m.type === type);
}

export function limitsFor(corridor: Corridor, type: DeliveryType) {
  const method = corridor.deliveryMethods.find((m) => m.type === type);
  if (!method) return null;
  return { min: method.minAmountMinor, max: method.maxAmountMinor };
}
