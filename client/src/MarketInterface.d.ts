import React from 'react';

export interface MarketData {
  globalStability: number;
  resources: Record<string, {
    current_price: number;
    price_trend: number;
    supply: number;
    demand: number;
  }>;
}

export interface MarketInterfaceProps {
  market: MarketData;
  playerResources?: Record<string, number>;
  playerCredits?: number;
  playerReputation?: number;
  factionRelations?: Record<string, number>;
  onBuy?: (resourceId: string, amount: number, price: number) => void;
  onSell?: (resourceId: string, amount: number, price: number) => void;
  onManipulate?: (action: string, target: any) => void;
  isProcessing?: boolean;
}

export default function MarketInterface(props: MarketInterfaceProps): JSX.Element;
