import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { JobFilters } from '../services/mockApi';
import { JobArea, JobLevel, JobType, RemoteType, Currency } from '../types';

export const useJobFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Parse URL to initial state
  const parseParams = (): JobFilters => ({
    query: searchParams.get('q') || '',
    areas: (searchParams.get('areas')?.split(',') as JobArea[]) || [],
    levels: (searchParams.get('levels')?.split(',') as JobLevel[]) || [],
    types: (searchParams.get('types')?.split(',') as JobType[]) || [],
    remoteTypes: (searchParams.get('remote')?.split(',') as RemoteType[]) || [],
    currencies: (searchParams.get('curr')?.split(',') as Currency[]) || [],
    minSalary: Number(searchParams.get('minSal')) || 0,
    techStack: searchParams.get('stack')?.split(',').filter(Boolean) || [],
    languages: searchParams.get('lang')?.split(',').filter(Boolean) || [],
    verifiedOnly: searchParams.get('verified') === 'true',
    salaryVisibleOnly: searchParams.get('publicSal') === 'true',
  });

  const [filters, setFilters] = useState<JobFilters>(parseParams());

  // Update internal state when URL changes (e.g. back button)
  useEffect(() => {
    setFilters(parseParams());
  }, [searchParams]);

  // Main function to push state to URL (Triggered by "Filter" button)
  const updateAllFilters = useCallback((newFilters: JobFilters) => {
    const params: any = {};
    if (newFilters.query) params.q = newFilters.query;
    if (newFilters.areas?.length) params.areas = newFilters.areas.join(',');
    if (newFilters.levels?.length) params.levels = newFilters.levels.join(',');
    if (newFilters.types?.length) params.types = newFilters.types.join(',');
    if (newFilters.remoteTypes?.length) params.remote = newFilters.remoteTypes.join(',');
    if (newFilters.currencies?.length) params.curr = newFilters.currencies.join(',');
    if (newFilters.minSalary) params.minSal = newFilters.minSalary.toString();
    if (newFilters.techStack?.length) params.stack = newFilters.techStack.join(',');
    if (newFilters.languages?.length) params.lang = newFilters.languages.join(',');
    if (newFilters.verifiedOnly) params.verified = 'true';
    if (newFilters.salaryVisibleOnly) params.publicSal = 'true';

    setSearchParams(params, { replace: true });
    // State update happens via the useEffect listening to searchParams
  }, [setSearchParams]);

  // Helper for single updates (immediate search bar, etc)
  const setSingleFilter = useCallback((key: keyof JobFilters, value: any) => {
    const updated = { ...filters, [key]: value };
    updateAllFilters(updated);
  }, [filters, updateAllFilters]);

  return {
    filters,
    setSingleFilter,
    updateAllFilters
  };
};