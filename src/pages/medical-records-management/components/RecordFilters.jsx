import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const RecordFilters = ({ 
  filters, 
  onFiltersChange, 
  onClearFilters, 
  recordCounts,
  isCollapsed,
  onToggleCollapse 
}) => {
  const categoryOptions = [
    { value: '', label: 'All Categories' },
    { value: 'allergy', label: 'Allergies' },
    { value: 'medication', label: 'Medications' },
    { value: 'treatment', label: 'Treatments' },
    { value: 'lab_result', label: 'Lab Results' },
    { value: 'imaging', label: 'Imaging' },
    { value: 'vaccination', label: 'Vaccinations' },
    { value: 'consultation', label: 'Consultations' },
    { value: 'surgery', label: 'Surgery' },
    { value: 'emergency', label: 'Emergency' }
  ];

  const providerOptions = [
    { value: '', label: 'All Providers' },
    { value: 'general_hospital', label: 'General Hospital' },
    { value: 'city_clinic', label: 'City Medical Clinic' },
    { value: 'specialist_center', label: 'Specialist Medical Center' },
    { value: 'emergency_care', label: 'Emergency Care Unit' },
    { value: 'diagnostic_lab', label: 'Diagnostic Laboratory' }
  ];

  const storageOptions = [
    { value: '', label: 'All Storage' },
    { value: 'ipfs', label: 'IPFS (Decentralized)' },
    { value: 'onchain', label: 'On-Chain' }
  ];

  const sortOptions = [
    { value: 'date_desc', label: 'Newest First' },
    { value: 'date_asc', label: 'Oldest First' },
    { value: 'title_asc', label: 'Title A-Z' },
    { value: 'title_desc', label: 'Title Z-A' },
    { value: 'provider_asc', label: 'Provider A-Z' }
  ];

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters?.search) count++;
    if (filters?.category) count++;
    if (filters?.provider) count++;
    if (filters?.storage) count++;
    if (filters?.dateFrom || filters?.dateTo) count++;
    if (filters?.hasAISummary !== null) count++;
    if (filters?.isEncrypted !== null) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className="bg-card border border-border rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <Icon name="Filter" size={16} className="text-muted-foreground" />
          <h3 className="text-sm font-medium text-foreground">Filters</h3>
          {activeFiltersCount > 0 && (
            <span className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              iconName="X"
              iconPosition="left"
            >
              Clear
            </Button>
          )}
          <button
            onClick={onToggleCollapse}
            className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-clinical"
          >
            <Icon name={isCollapsed ? "ChevronDown" : "ChevronUp"} size={16} />
          </button>
        </div>
      </div>
      {/* Filters Content */}
      <div className={`${isCollapsed ? 'hidden lg:block' : 'block'}`}>
        <div className="p-4 space-y-4">
          {/* Search */}
          <Input
            type="search"
            placeholder="Search records..."
            value={filters?.search}
            onChange={(e) => handleFilterChange('search', e?.target?.value)}
            className="w-full"
          />

          {/* Category Filter */}
          <Select
            label="Category"
            options={categoryOptions}
            value={filters?.category}
            onChange={(value) => handleFilterChange('category', value)}
          />

          {/* Provider Filter */}
          <Select
            label="Provider"
            options={providerOptions}
            value={filters?.provider}
            onChange={(value) => handleFilterChange('provider', value)}
          />

          {/* Date Range */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Date Range</label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="date"
                placeholder="From"
                value={filters?.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e?.target?.value)}
              />
              <Input
                type="date"
                placeholder="To"
                value={filters?.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e?.target?.value)}
              />
            </div>
          </div>

          {/* Storage Type */}
          <Select
            label="Storage Type"
            options={storageOptions}
            value={filters?.storage}
            onChange={(value) => handleFilterChange('storage', value)}
          />

          {/* Sort */}
          <Select
            label="Sort By"
            options={sortOptions}
            value={filters?.sortBy}
            onChange={(value) => handleFilterChange('sortBy', value)}
          />

          {/* Quick Filters */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">Quick Filters</label>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Has AI Summary</span>
              <button
                onClick={() => handleFilterChange('hasAISummary', filters?.hasAISummary === true ? null : true)}
                className={`flex items-center justify-center w-5 h-5 rounded border-2 transition-clinical ${
                  filters?.hasAISummary === true
                    ? 'bg-primary border-primary text-primary-foreground'
                    : 'border-border hover:border-primary'
                }`}
              >
                {filters?.hasAISummary === true && <Icon name="Check" size={12} />}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Encrypted Only</span>
              <button
                onClick={() => handleFilterChange('isEncrypted', filters?.isEncrypted === true ? null : true)}
                className={`flex items-center justify-center w-5 h-5 rounded border-2 transition-clinical ${
                  filters?.isEncrypted === true
                    ? 'bg-primary border-primary text-primary-foreground'
                    : 'border-border hover:border-primary'
                }`}
              >
                {filters?.isEncrypted === true && <Icon name="Check" size={12} />}
              </button>
            </div>
          </div>
        </div>

        {/* Record Counts */}
        <div className="p-4 border-t border-border">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Total Records</span>
              <span className="font-medium text-foreground">{recordCounts?.total}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Filtered</span>
              <span className="font-medium text-foreground">{recordCounts?.filtered}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">With AI Summary</span>
              <span className="font-medium text-foreground">{recordCounts?.withAI}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecordFilters;