import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Check, MapPin, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from './LanguageContext';

export default function PositionSelector({
  positions = [],
  selectedPosition,
  onSelect,
  isCustomerStorage = false,
  disabled = false
}) {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const [selectedAisle, setSelectedAisle] = useState(null);

  const prefix = isCustomerStorage ? 'C-' : '';

  // Get all aisles (A-Z)
  const aisles = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  // Filter available positions (not occupied)
  const availablePositions = useMemo(() => {
    return positions.filter(p => !p.is_occupied);
  }, [positions]);

  // Group positions by aisle
  const positionsByAisle = useMemo(() => {
    const grouped = {};
    availablePositions.forEach(pos => {
      const aisle = pos.aisle;
      if (!grouped[aisle]) grouped[aisle] = [];
      grouped[aisle].push(pos);
    });
    return grouped;
  }, [availablePositions]);

  // Filter positions based on search
  const filteredPositions = useMemo(() => {
    if (!search && !selectedAisle) return availablePositions;

    return availablePositions.filter(pos => {
      const matchesSearch = !search ||
        pos.position_code.toLowerCase().includes(search.toLowerCase());
      const matchesAisle = !selectedAisle || pos.aisle === selectedAisle;
      return matchesSearch && matchesAisle;
    });
  }, [availablePositions, search, selectedAisle]);

  const formatPosition = (pos) => {
    return `${prefix}${pos.position_code}`;
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          type="text"
          placeholder={t('search')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
          disabled={disabled}
        />
      </div>

      {/* Aisle Filter */}
      <div className="flex flex-wrap gap-1">
        <Button
          variant={selectedAisle === null ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedAisle(null)}
          disabled={disabled}
          className="h-8"
        >
          {t('all')}
        </Button>
        {aisles.slice(0, 10).map(aisle => (
          <Button
            key={aisle}
            variant={selectedAisle === aisle ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedAisle(aisle)}
            disabled={disabled || !positionsByAisle[aisle]?.length}
            className={cn(
              "h-8 w-8 p-0",
              !positionsByAisle[aisle]?.length && "opacity-50"
            )}
          >
            {aisle}
          </Button>
        ))}
      </div>

      {/* Position List */}
      <ScrollArea className="h-48 rounded-lg border border-gray-200">
        <div className="p-2 grid grid-cols-3 gap-1">
          {filteredPositions.length === 0 ? (
            <div className="col-span-3 text-center py-4 text-gray-500 text-sm">
              {t('noResults')}
            </div>
          ) : (
            filteredPositions.map(pos => (
              <Button
                key={pos.id}
                variant={selectedPosition === pos.position_code ? "default" : "outline"}
                size="sm"
                onClick={() => onSelect(pos.position_code)}
                disabled={disabled}
                className={cn(
                  "justify-start text-xs h-9",
                  selectedPosition === pos.position_code && "bg-blue-600"
                )}
              >
                <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                <span className="truncate">{formatPosition(pos)}</span>
                {selectedPosition === pos.position_code && (
                  <Check className="w-3 h-3 ml-auto flex-shrink-0" />
                )}
              </Button>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Selected Position Display */}
      {selectedPosition && (
        <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <MapPin className="w-4 h-4 text-blue-600" />
          <span className="font-medium text-blue-900">
            {t('position')}: {prefix}{selectedPosition}
          </span>
        </div>
      )}
    </div>
  );
}
