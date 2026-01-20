import React from 'react';

export interface TradeRoute {
  id: string;
  partner_name: string;
  resource_type: string;
  value: number;
  status: 'active' | 'inactive';
  established_turn: number;
}

export interface TradePartner {
  id: string;
  house_name: string;
  player_house_relation: number;
}

export interface TradeRouteManagerProps {
  tradeRoutes?: TradeRoute[];
  availablePartners?: TradePartner[];
  tradeHubs?: number;
  onEstablishRoute?: (partnerId: string) => void;
  onCancelRoute?: (routeId: string) => void;
  isProcessing?: boolean;
}

export function calculateTradeIncome(
  tradeRoutes: TradeRoute[],
  marketPrices: Record<string, number>,
  tradeHubs: number
): number;

export default function TradeRouteManager(props: TradeRouteManagerProps): JSX.Element;
