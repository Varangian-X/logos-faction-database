import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Search,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  Lock,
  Unlock,
  AlertTriangle,
  Info,
  Star,
} from 'lucide-react';
import {
  marketCatalog,
  getAllItems,
  getItemsByCategory,
  rarityColors,
  categoryIcons,
  type ItemCategory,
  type MarketItem,
} from '@/lib/marketCatalog';
import {
  calculateFactionPriceModifiers,
  getFactionMarketAccess,
  isItemAvailable,
  type MarketPriceModifiers,
} from '@/lib/marketIntegration';
import { initializeDefaultStandings, type PlayerFactionStanding } from '@/lib/factionStanding';
import { getFactionMetrics } from '@/lib/factionMetrics';
import { calculatePendulumState } from '@/lib/byzantinePendulum';

/**
 * Dynamic Market Interface
 * Faction-driven pricing with real-time modifiers
 */

export default function DynamicMarket() {
  // Initialize player standings (in real game, this would come from game state)
  const [playerStandings] = useState<PlayerFactionStanding[]>(initializeDefaultStandings());
  const [playerCredits] = useState<number>(100000); // Mock player credits
  
  // UI state
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory>('weapons');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<MarketItem | null>(null);
  const [cart, setCart] = useState<Array<{ item: MarketItem; quantity: number }>>([]);

  // Calculate active factions for Pendulum state
  const activeFactionIds = useMemo(() => 
    playerStandings.map(s => s.factionId),
    [playerStandings]
  );

  // Get faction market access
  const marketAccess = useMemo(() => 
    getFactionMarketAccess(playerStandings),
    [playerStandings]
  );

  // Filter items based on search and category
  const filteredItems = useMemo(() => {
    let items = getItemsByCategory(selectedCategory);
    
    if (searchQuery) {
      items = items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return items;
  }, [selectedCategory, searchQuery]);

  // Calculate price modifiers for an item
  const getPriceModifiers = (item: MarketItem): MarketPriceModifiers => {
    return calculateFactionPriceModifiers(
      item.factionId,
      item.basePrice,
      playerStandings,
      activeFactionIds
    );
  };

  // Check if item is available
  const checkAvailability = (item: MarketItem) => {
    return isItemAvailable(item.factionId, playerStandings);
  };

  // Add item to cart
  const addToCart = (item: MarketItem) => {
    const existing = cart.find(c => c.item.id === item.id);
    if (existing) {
      setCart(cart.map(c => 
        c.item.id === item.id 
          ? { ...c, quantity: c.quantity + 1 }
          : c
      ));
    } else {
      setCart([...cart, { item, quantity: 1 }]);
    }
  };

  // Calculate cart total
  const cartTotal = useMemo(() => {
    return cart.reduce((total, { item, quantity }) => {
      const priceInfo = getPriceModifiers(item);
      return total + (priceInfo.finalPrice * quantity);
    }, 0);
  }, [cart, playerStandings]);

  return (
    <div className="min-h-screen bg-[#0A0E17] text-white p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-3xl font-serif text-[#D4AF37]">Dynamic Market</h1>
            <p className="text-white/60">Faction-driven pricing // Real-time volatility</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-white/50">Your Credits</div>
              <div className="text-2xl font-bold text-[#D4AF37]">{playerCredits.toLocaleString()}</div>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-[#D4AF37]/30 text-[#D4AF37] relative">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Cart
                  {cart.length > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-[#FF3333]">
                      {cart.length}
                    </Badge>
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#0A0E17] border-[#D4AF37]/30 text-white max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-[#D4AF37]">Shopping Cart</DialogTitle>
                  <DialogDescription className="text-white/60">
                    Review your purchases
                  </DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-96">
                  {cart.length === 0 ? (
                    <div className="text-center py-8 text-white/50">
                      Cart is empty
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {cart.map(({ item, quantity }) => {
                        const priceInfo = getPriceModifiers(item);
                        return (
                          <div key={item.id} className="p-3 bg-white/5 rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <div className="font-semibold">{item.name}</div>
                                <div className="text-sm text-white/50">Quantity: {quantity}</div>
                              </div>
                              <div className="text-right">
                                <div className="text-[#D4AF37]">
                                  {(priceInfo.finalPrice * quantity).toLocaleString()} CR
                                </div>
                                <div className="text-xs text-white/50">
                                  {priceInfo.finalPrice.toLocaleString()} × {quantity}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      <Separator className="bg-white/10" />
                      <div className="flex justify-between items-center text-lg font-bold">
                        <span>Total</span>
                        <span className="text-[#D4AF37]">{cartTotal.toLocaleString()} CR</span>
                      </div>
                      <Button 
                        className="w-full bg-[#D4AF37] text-black hover:bg-[#D4AF37]/80"
                        disabled={cartTotal > playerCredits}
                      >
                        {cartTotal > playerCredits ? 'Insufficient Credits' : 'Complete Purchase'}
                      </Button>
                    </div>
                  )}
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Faction Market Access Summary */}
      <div className="max-w-7xl mx-auto mb-6">
        <Card className="bg-black/40 border-[#D4AF37]/30">
          <CardHeader>
            <CardTitle className="text-sm text-white/70">Faction Market Access</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-3">
              {marketAccess.map(access => (
                <div key={access.factionId} className="text-center p-2 bg-white/5 rounded">
                  <div className="text-xs text-white/50 mb-1">{access.factionName}</div>
                  <Badge 
                    variant="outline"
                    className={
                      access.relationship === 'allied' ? 'text-[#00E5FF] border-[#00E5FF]' :
                      access.relationship === 'friendly' ? 'text-green-500 border-green-500' :
                      access.relationship === 'hostile' ? 'text-[#FF3333] border-[#FF3333]' :
                      'text-white/70 border-white/30'
                    }
                  >
                    {access.discountPercentage > 0 ? '+' : ''}{access.discountPercentage}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
          <Input
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-black/40 border-white/10 text-white"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <Tabs value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as ItemCategory)}>
          <TabsList className="grid w-full grid-cols-5 bg-black/40">
            {Object.keys(marketCatalog).map(category => (
              <TabsTrigger key={category} value={category} className="capitalize">
                {categoryIcons[category as ItemCategory]} {category}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={selectedCategory} className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.map(item => {
                const priceInfo = getPriceModifiers(item);
                const availability = checkAvailability(item);
                const faction = item.factionId ? getFactionMetrics(item.factionId) : null;

                return (
                  <Card 
                    key={item.id} 
                    className={`bg-black/40 border-white/10 hover:border-[#D4AF37]/50 transition-all cursor-pointer ${
                      !availability.available ? 'opacity-50' : ''
                    }`}
                    onClick={() => setSelectedItem(item)}
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="outline" className={rarityColors[item.rarity]}>
                          {item.rarity}
                        </Badge>
                        {faction && (
                          <Badge variant="outline" className="text-xs text-white/70 border-white/30">
                            {faction.factionName}
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-white">{item.name}</CardTitle>
                      <CardDescription className="text-white/60 text-sm line-clamp-2">
                        {item.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {/* Price Display */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-white/50">Base Price</span>
                          <span className="text-sm line-through text-white/30">
                            {priceInfo.basePrice.toLocaleString()} CR
                          </span>
                        </div>
                        
                        {priceInfo.factionDiscount !== 0 && (
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-white/50">Faction Modifier</span>
                            <span className={`text-xs ${priceInfo.factionDiscount < 0 ? 'text-green-500' : 'text-[#FF3333]'}`}>
                              {priceInfo.factionDiscount > 0 ? '+' : ''}{priceInfo.factionDiscount}%
                            </span>
                          </div>
                        )}
                        
                        {priceInfo.conflictPenalty > 0 && (
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-white/50">Conflict Penalty</span>
                            <span className="text-xs text-[#FF3333]">
                              +{priceInfo.conflictPenalty}%
                            </span>
                          </div>
                        )}
                        
                        {priceInfo.pendulumVolatility !== 0 && (
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-white/50">Market Volatility</span>
                            <span className={`text-xs ${priceInfo.pendulumVolatility < 0 ? 'text-green-500' : 'text-[#FF3333]'}`}>
                              {priceInfo.pendulumVolatility > 0 ? '+' : ''}{priceInfo.pendulumVolatility}%
                            </span>
                          </div>
                        )}

                        <Separator className="bg-white/10" />
                        
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold text-white">Final Price</span>
                          <div className="text-right">
                            <div className="text-xl font-bold text-[#D4AF37]">
                              {priceInfo.finalPrice.toLocaleString()} CR
                            </div>
                            {priceInfo.finalPrice !== priceInfo.basePrice && (
                              <div className="text-xs text-white/50">
                                {((priceInfo.finalPrice / priceInfo.basePrice - 1) * 100).toFixed(0)}% 
                                {priceInfo.finalPrice < priceInfo.basePrice ? ' discount' : ' markup'}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Availability Status */}
                        {!availability.available ? (
                          <Alert className="bg-[#FF3333]/10 border-[#FF3333]/30">
                            <Lock className="h-4 w-4 text-[#FF3333]" />
                            <AlertDescription className="text-xs text-white">
                              {availability.reason}
                            </AlertDescription>
                          </Alert>
                        ) : item.requiresAlliance && (
                          <Alert className="bg-[#00E5FF]/10 border-[#00E5FF]/30">
                            <Star className="h-4 w-4 text-[#00E5FF]" />
                            <AlertDescription className="text-xs text-white">
                              Exclusive: Alliance Required
                            </AlertDescription>
                          </Alert>
                        )}

                        <Button
                          className="w-full bg-[#D4AF37] text-black hover:bg-[#D4AF37]/80"
                          disabled={!availability.available || priceInfo.finalPrice > playerCredits}
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(item);
                          }}
                        >
                          {!availability.available ? (
                            <>
                              <Lock className="w-4 h-4 mr-2" />
                              Locked
                            </>
                          ) : priceInfo.finalPrice > playerCredits ? (
                            'Insufficient Credits'
                          ) : (
                            <>
                              <ShoppingCart className="w-4 h-4 mr-2" />
                              Add to Cart
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Back Navigation */}
      <div className="max-w-7xl mx-auto mt-6">
        <Button 
          variant="outline" 
          onClick={() => window.history.back()}
          className="border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10"
        >
          ← Back to Menu
        </Button>
      </div>
    </div>
  );
}
