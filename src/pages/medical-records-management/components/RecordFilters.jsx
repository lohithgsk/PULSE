import React, { useState } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";

const RecordFilters = ({
  filters,
  onFiltersChange,
  onClearFilters,
  recordCounts,
  isCollapsed,
  onToggleCollapse,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const categoryOptions = [
    { value: "", label: "All Categories" },
    { value: "allergy", label: "Allergies" },
    { value: "medication", label: "Medications" },
    { value: "treatment", label: "Treatments" },
    { value: "lab_result", label: "Lab Results" },
    { value: "imaging", label: "Imaging" },
    { value: "vaccination", label: "Vaccinations" },
    { value: "consultation", label: "Consultations" },
    { value: "surgery", label: "Surgery" },
    { value: "emergency", label: "Emergency" },
  ];

  const providerOptions = [
    { value: "", label: "All Providers" },
    { value: "general_hospital", label: "General Hospital" },
    { value: "city_clinic", label: "City Medical Clinic" },
    { value: "specialist_center", label: "Specialist Medical Center" },
    { value: "emergency_care", label: "Emergency Care Unit" },
    { value: "diagnostic_lab", label: "Diagnostic Laboratory" },
  ];

  const storageOptions = [
    { value: "", label: "All Storage Types" },
    { value: "ipfs", label: "IPFS Distributed" },
    { value: "onchain", label: "Blockchain" },
  ];

  const sortOptions = [
    { value: "date_desc", label: "Newest First" },
    { value: "date_asc", label: "Oldest First" },
    { value: "title_asc", label: "Title A-Z" },
    { value: "provider_asc", label: "Provider A-Z" },
  ];

  const handleFilterChange = (key, value) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const hasActiveFilters = () => {
    return filters?.search || 
           filters?.category || 
           filters?.provider || 
           filters?.dateFrom || 
           filters?.dateTo || 
           filters?.storage || 
           filters?.hasAISummary !== null || 
           filters?.isEncrypted !== null;
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

  return (
  <div className="bg-card border border-border rounded-lg shadow-medical-card overflow-hidden lg:rounded-lg rounded-md w-full max-w-sm mx-auto lg:max-w-none">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-lg">
            <Icon name="Filter" size={16} className="text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Filters</h3>
            <p className="text-xs text-muted-foreground flex items-center gap-2">
              {recordCounts?.filtered || 0}/{recordCounts?.total || 0}
              {getActiveFiltersCount() > 0 && (
                <span className="px-1.5 py-0.5 bg-primary/15 text-primary rounded text-[10px] font-medium leading-none">
                  {getActiveFiltersCount()}
                </span>
              )}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {hasActiveFilters() && (
            <Button 
              variant="ghost" 
              size="xs" 
              onClick={onClearFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              <Icon name="X" size={12} className="mr-1" />
              Clear
            </Button>
          )}
          <button
            onClick={onToggleCollapse}
            className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
          >
            <Icon
              name={isCollapsed ? "ChevronDown" : "ChevronUp"}
              size={16}
            />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className={`${isCollapsed ? "hidden lg:block" : "block"}`}>
  <div className="p-4 space-y-4 sm:space-y-5">
          {/* Search */}
          <div className="relative">
            <Icon
              name="Search"
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              type="search"
              placeholder="Search records"
              value={filters?.search}
              onChange={(e) => handleFilterChange("search", e?.target?.value)}
              className="pl-10 h-10 text-sm border-border focus:border-primary"
            />
          </div>

          {/* Primary Filters */}
          <div className="space-y-3">
            <Select
              options={categoryOptions}
              value={filters?.category}
              onChange={(value) => handleFilterChange("category", value)}
              placeholder="Select Category"
              searchable={true}
              clearable={true}
              className="h-10"
            />
            <Select
              options={providerOptions}
              value={filters?.provider}
              onChange={(value) => handleFilterChange("provider", value)}
              placeholder="Select Provider"
              searchable={true}
              clearable={true}
              className="h-10"
            />
            <Select
              options={sortOptions}
              value={filters?.sortBy}
              onChange={(value) => handleFilterChange("sortBy", value)}
              placeholder="Sort Order"
              className="h-10"
            />
          </div>

          {/* Advanced Filters Toggle */}
          <div className="pt-2">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center justify-between w-full p-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-all"
            >
              <div className="flex items-center space-x-2">
                <Icon name="Settings" size={14} />
                <span>Advanced</span>
              </div>
              <Icon
                name="ChevronDown"
                size={14}
                className={`transform transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
              />
            </button>
          </div>

          {/* Advanced Filters */}
          {showAdvanced && (
            <div className="space-y-4 pt-2 border-t border-border">
              {/* Date Range */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground flex items-center space-x-1">
                  <Icon name="Calendar" size={12} />
                  <span>Date</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">From</label>
                    <Input
                      type="date"
                      value={filters?.dateFrom}
                      onChange={(e) => handleFilterChange("dateFrom", e?.target?.value)}
                      className="h-9 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">To</label>
                    <Input
                      type="date"
                      value={filters?.dateTo}
                      onChange={(e) => handleFilterChange("dateTo", e?.target?.value)}
                      className="h-9 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Storage Type */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground flex items-center space-x-1">
                  <Icon name="Database" size={12} />
                  <span>Storage</span>
                </label>
                <Select
                  options={storageOptions}
                  value={filters?.storage}
                  onChange={(value) => handleFilterChange("storage", value)}
                  placeholder="All Storage Types"
                  clearable={true}
                  className="h-9"
                />
              </div>

              {/* Filter Options */}
              <div className="space-y-3">
                <label className="text-xs font-medium text-foreground flex items-center space-x-1">
                  <Icon name="Sliders" size={12} />
                  <span>Flags</span>
                </label>
                
                <div className="space-y-2">
                  {[
                    {
                      key: "hasAISummary",
                      label: "Has AI Summary",
                      icon: "Brain",
                      description: "Records with AI-generated summaries"
                    },
                    {
                      key: "isEncrypted",
                      label: "Encrypted Records",
                      icon: "Shield",
                      description: "End-to-end encrypted records only"
                    },
                  ].map((option) => (
                    <div
                      key={option.key}
                      className="flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Icon name={option.icon} size={14} className="text-muted-foreground" />
                        <span className="text-xs font-medium text-foreground">{option.label}</span>
                      </div>
                      <button
                        onClick={() =>
                          handleFilterChange(
                            option.key,
                            filters?.[option.key] === true ? null : true
                          )
                        }
                        className={`flex items-center justify-center w-5 h-5 rounded border transition-all ${
                          filters?.[option.key] === true
                            ? "bg-primary border-primary text-primary-foreground"
                            : "border-border hover:border-primary"
                        }`}
                      >
                        {filters?.[option.key] === true && (
                          <Icon name="Check" size={12} />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Statistics Footer */}
        <div className="px-4 py-3 border-t border-border bg-muted/20">
      <div className="grid grid-cols-3 gap-3 text-center text-[11px]">
            <div>
              <div className="text-lg font-semibold text-foreground">{recordCounts?.total || 0}</div>
        <div className="text-[10px] text-muted-foreground">Total</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-primary">{recordCounts?.filtered || 0}</div>
        <div className="text-[10px] text-muted-foreground">Filtered</div>
            </div>
            <div>
        <div className="text-lg font-semibold text-accent">{recordCounts?.withAI || 0}</div>
        <div className="text-[10px] text-muted-foreground">AI</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecordFilters;
