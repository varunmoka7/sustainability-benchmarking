'use client';

import { useState, Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react'; // Will require installation
import { Check, ChevronDown, PlusCircle, RefreshCw, Search } from 'lucide-react'; // Will require installation

// This would typically come from props or a data store.
// Ensure this matches the structure you intend to use.
export interface Country {
  code: string; // e.g., 'DE'
  name: string; // e.g., 'Germany'
  flag?: string; // e.g., '🇩🇪' or path to an image
}

interface CountrySelectorControlsProps {
  countries: Country[];
  selectedCountry: Country | null;
  onCountryChange: (country: Country | null) => void; // Allow null for clearing selection via RESET
  onAddToCompare?: (country: Country) => void; // Optional compare functionality
  onReset: () => void;
  // Add other props like isLoading, etc., if needed
}

export default function CountrySelectorControls({
  countries = [], 
  selectedCountry,
  onCountryChange,
  onAddToCompare,
  onReset,
}: CountrySelectorControlsProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCountries = searchTerm === ''
    ? countries
    : countries.filter((country) =>
        country.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

  return (
    <div className="my-6 p-4 bg-gray-50 dark:bg-neutral-dark rounded-lg shadow flex flex-wrap items-center gap-x-4 gap-y-3">
      <div className="flex-grow min-w-[250px] sm:min-w-[300px]">
        <Listbox value={selectedCountry} onChange={onCountryChange}>
          <div className="relative">
            <Listbox.Button 
              className="relative w-full cursor-default rounded-md bg-white dark:bg-deep-slate py-2.5 pl-3 pr-10 text-left text-gray-900 dark:text-primary-text-on-slate shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-neutral-light focus:outline-none focus:ring-2 focus:ring-action-teal sm:text-sm sm:leading-6"
              aria-label="Select a country"
            >
              <span className="block truncate">
                {selectedCountry ? `${selectedCountry.flag ? selectedCountry.flag + ' ' : ''}${selectedCountry.name}` : 'Select a country'}
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronDown className="h-5 w-5 text-gray-400 dark:text-secondary-text-on-slate" aria-hidden="true" />
              </span>
            </Listbox.Button>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-20 mt-1 max-h-72 w-full overflow-auto rounded-md bg-white dark:bg-deep-slate py-1 text-base shadow-lg ring-1 ring-black dark:ring-neutral-light ring-opacity-5 focus:outline-none sm:text-sm">
                <div className="p-2 sticky top-0 bg-white dark:bg-deep-slate z-10">
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Search className="h-4 w-4 text-gray-400 dark:text-secondary-text-on-slate" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search country..."
                      className="w-full rounded-md border-gray-300 dark:border-neutral-light bg-white dark:bg-neutral-dark dark:text-primary-text-on-slate py-1.5 pl-10 pr-3 text-sm focus:ring-1 focus:ring-action-teal focus:border-action-teal"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      aria-label="Search for a country in the list"
                    />
                  </div>
                </div>
                {filteredCountries.length > 0 ? filteredCountries.map((country) => (
                  <Listbox.Option
                    key={country.code}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? 'bg-banner-blue text-banner-text' : 'text-gray-900 dark:text-primary-text-on-slate'
                      }`
                    }
                    value={country}
                  >
                    {({ selected }) => (
                      <>
                        <span className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>
                          {country.flag ? country.flag + ' ' : ''}{country.name}
                        </span>
                        {selected ? (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-action-teal">
                            <Check className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                )) : (
                  <div className="relative cursor-default select-none py-2 px-4 text-gray-700 dark:text-secondary-text-on-slate">
                    No countries found.
                  </div>
                )}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>
      </div>

      {onAddToCompare && (
        <button
          onClick={() => selectedCountry && onAddToCompare(selectedCountry)}
          disabled={!selectedCountry}
          className="flex items-center px-4 py-2.5 bg-action-teal text-white text-sm font-medium rounded-md shadow-sm hover:bg-action-teal-hover disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          aria-label={selectedCountry ? `Add ${selectedCountry.name} to comparison` : "Add to compare (select a country first)"}
        >
          <PlusCircle size={18} className="mr-2" />
          Add to compare
        </button>
      )}

      <button
        onClick={onReset}
        className="flex items-center px-4 py-2.5 bg-gray-200 dark:bg-neutral-light text-gray-700 dark:text-primary-text-on-slate text-sm font-medium rounded-md shadow-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        aria-label="Reset all filters and selections"
      >
        <RefreshCw size={18} className="mr-2" />
        RESET
      </button>
    </div>
  );
}
