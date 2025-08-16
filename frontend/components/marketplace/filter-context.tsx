"use client"

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react"

export interface FilterState {
  categories: string[]
  brands: string[]
  sizes: string[]
  colors: string[]
  priceRange: [number, number]
  ratings: number[]
  searchQuery: string
  sortBy: string
}

interface FilterContextType {
  filters: FilterState
  updateFilters: (updates: Partial<FilterState>) => void
  resetFilters: () => void
  applyFilters: () => void
  isFilterActive: (filterType: keyof FilterState, value: any) => boolean
}

const initialFilters: FilterState = {
  categories: [],
  brands: [],
  sizes: [],
  colors: [],
  priceRange: [0, 500],
  ratings: [],
  searchQuery: "",
  sortBy: "relevance"
}

const FilterContext = createContext<FilterContextType | undefined>(undefined)

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<FilterState>(initialFilters)

  const updateFilters = useCallback((updates: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...updates }))
  }, [])

  const resetFilters = useCallback(() => {
    setFilters(initialFilters)
  }, [])

  const applyFilters = useCallback(() => {
    // This would typically trigger a search/API call
    console.log("Applying filters:", filters)
  }, [filters])

  const isFilterActive = useCallback((filterType: keyof FilterState, value: string | number) => {
    const filterValue = filters[filterType]
    
    if (Array.isArray(filterValue)) {
      return filterValue.includes(value as never)
    }
    
    if (filterType === 'priceRange' && Array.isArray(filterValue) && filterValue.length === 2) {
      const [min, max] = filterValue as [number, number]
      return typeof value === 'number' && value >= min && value <= max
    }
    
    if (filterType === 'searchQuery') {
      return filterValue === value
    }
    
    if (filterType === 'sortBy') {
      return filterValue === value
    }
    
    return false
  }, [filters])

  const value: FilterContextType = {
    filters,
    updateFilters,
    resetFilters,
    applyFilters,
    isFilterActive
  }

  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  )
}

export function useFilters() {
  const context = useContext(FilterContext)
  if (context === undefined) {
    throw new Error("useFilters must be used within a FilterProvider")
  }
  return context
}
