// components/common/SearchModal.tsx
import { useState } from 'react';
import { FiX, FiSearch } from 'react-icons/fi';
import { categoryItems } from './categoryItems';
import useSearchModal from './useSearchModal';
import nigerianStatesWithLga from './NigerianStatesWithLga';

interface SearchModalProps {
  onApplyFilters: (filters: any) => void;
}

export const SearchModal = ({ onApplyFilters }: SearchModalProps) => {
  const searchModal = useSearchModal();
  const [selectedMode, setSelectedMode] = useState<'Rent' | 'Sale' | 'All'>('All');
  const [selectedType, setSelectedType] = useState<'Building' | 'Land' | 'All'>('All');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedLga, setSelectedLga] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);

  const handleStateChange = (state: string | null) => {
    setSelectedState(state);
    setSelectedLga(null); // Reset LGA when state changes
  };

  if (!searchModal.isOpen) return null;

  const handleApplyFilters = () => {
    onApplyFilters({
      mode: selectedMode,
      type: selectedType,
      category: selectedCategory,
      state: selectedState,
      lga: selectedLga,
      priceRange
    });
    searchModal.onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Search Filters</h2>
          <button onClick={searchModal.onClose} className="text-gray-500 hover:text-gray-700">
            <FiX size={24} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Mode Filter */}
          <div>
            <h3 className="font-medium mb-3">Transaction Type</h3>
            <div className="flex bg-gray-100 rounded-full p-1">
              {['All', 'Rent', 'Sale'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setSelectedMode(mode === 'All' ? 'All' : mode as 'Rent' | 'Sale')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedMode === mode || (mode === 'All' && selectedMode === 'All')
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Property Type */}
          <div>
            <h3 className="font-medium mb-3">Property Type</h3>
            <div className="flex bg-gray-100 rounded-full p-1">
              {['All', 'Building', 'Land'].map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setSelectedType(type === 'All' ? 'All' : type as 'Building' | 'Land');
                    if (type === 'Land') setSelectedCategory(null);
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedType === type || (type === 'All' && selectedType === 'All')
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Category (only for Buildings) */}
          {selectedType !== 'Land' && (
            <div>
              <h3 className="font-medium mb-3">Property Category</h3>
              <div className="flex flex-wrap gap-2">
                {categoryItems.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(selectedCategory === category.label ? null : category.label)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category.label
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <category.icon className="w-4 h-4" />
                    {category.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Location Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-3">State</h3>
              <select 
                className="w-full p-3 border rounded-lg"
                value={selectedState || ''}
                onChange={(e) => handleStateChange(e.target.value || null)}
              >
                <option value="">All States</option>
                {Object.keys(nigerianStatesWithLga).map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <h3 className="font-medium mb-3">LGA</h3>
              <select 
                className={`w-full p-3 border rounded-lg ${
                  !selectedState ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
                value={selectedLga || ''}
                onChange={(e) => setSelectedLga(e.target.value || null)}
                disabled={!selectedState}
              >
                <option value="">All LGAs</option>
                {selectedState && nigerianStatesWithLga[selectedState as keyof typeof nigerianStatesWithLga]?.map((lga) => (
                  <option key={lga} value={lga}>
                    {lga}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h3 className="font-medium mb-3">Price Range</h3>
            <div className="flex items-center gap-4">
              <input
                type="number"
                placeholder="Min"
                className="flex-1 p-3 border rounded-lg"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
              />
              <span>to</span>
              <input
                type="number"
                placeholder="Max"
                className="flex-1 p-3 border rounded-lg"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
              />
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={searchModal.onClose}
            className="px-6 py-3 border rounded-lg font-medium hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleApplyFilters}
            className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};