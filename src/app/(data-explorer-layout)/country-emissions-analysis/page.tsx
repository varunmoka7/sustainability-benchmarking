'use client';

import { useState, useEffect, useCallback } from 'react';
// Adjusted import paths assuming you will rename 'country-emissions' to 'company-emissions'
import CompanySelectorControls from '@/components/company-emissions/CompanySelectorControls';
import type { CompanySelectItem } from '@/components/company-emissions/CompanySelectorControls';
import ChartView, { EmissionDataPoint } from '@/components/company-emissions/ChartView';
import EmissionsTable from '@/components/company-emissions/EmissionsTable';
import DataDownloadButton from '@/components/company-emissions/DataDownloadButton';
import { Share2, Twitter, Facebook, Linkedin } from 'lucide-react';
import { getAllCompanyNames, getCompanyEmissionsById, getAnnualCompanyScopeTotals, getCompanyScope3Categories } from '@/lib/data-fetchers';
import type { Company as DbCompany, EmissionRecord } from '@/lib/data-fetchers';

// Helper to get last N unique sorted string years from a list of records
const getLastNUniqueYears = (records: { reporting_period: string }[], count: number): string[] => {
  if (!records || records.length === 0) return [];
  const uniqueYears = Array.from(new Set(records.map(r => r.reporting_period.toString())));
  // Sort numerically if possible, otherwise lexicographically
  return uniqueYears.sort((a, b) => {
    const numA = parseInt(a, 10);
    const numB = parseInt(b, 10);
    if (!isNaN(numA) && !isNaN(numB)) {
      return numB - numA; // Descending for years
    }
    return b.localeCompare(a); // Fallback to string descending
  }).slice(0, count);
};

export default function CompanyEmissionsPage() {
  const [availableCompanies, setAvailableCompanies] = useState<CompanySelectItem[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<CompanySelectItem | null>(null);
  
  const [companyDetails, setCompanyDetails] = useState<DbCompany | null>(null);
  const [chartData, setChartData] = useState<EmissionDataPoint[]>([]); // For the main overview chart
  const [annualScopeTotals, setAnnualScopeTotals] = useState<any[]>([]); // For the Scope 1,2,3 table
  const [scope3Categories, setScope3Categories] = useState<any[]>([]); // For the Scope 3 categories table
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCompanyList() {
      setIsLoading(true);
      const companiesFromDb = await getAllCompanyNames();
      const selectorCompanies = companiesFromDb.map(c => ({ id: c.company_id, name: c.company_name }));
      setAvailableCompanies(selectorCompanies);
      // Optionally select the first company by default or based on URL param
      // if (selectorCompanies.length > 0) {
      //   setSelectedCompany(selectorCompanies[0]); 
      // }
      setIsLoading(false);
    }
    loadCompanyList();
  }, []);

  const fetchCompanyData = useCallback(async (companyId: string) => {
    if (!companyId) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await getCompanyEmissionsById(companyId); // Fetches company details and all its emissions
      if (data) {
        setCompanyDetails(data.company);
        
        // Example: Populate main chart with Scope 1 emissions trend
        const scope1Emissions = data.emissions
          .filter(e => e.scope_type === 'Scope 1' && typeof e.value === 'number')
          .map(e => ({ year: e.reporting_period, emissions: e.value as number }))
          .sort((a,b) => a.year.toString().localeCompare(b.year.toString(), undefined, {numeric: true})); // Sort by year
        setChartData(scope1Emissions);

        const companyLast5Years = getLastNUniqueYears(data.emissions, 5);

        if (companyLast5Years.length > 0) {
          const annualTotalsData = await getAnnualCompanyScopeTotals(companyId, companyLast5Years);
          setAnnualScopeTotals(annualTotalsData);

          const scope3CategoriesData = await getCompanyScope3Categories(companyId, companyLast5Years);
          setScope3Categories(scope3CategoriesData);
        } else {
          setAnnualScopeTotals([]);
          setScope3Categories([]);
        }
      } else {
        setError(`Company data not found for ID: ${companyId}`);
        setCompanyDetails(null); setChartData([]); setAnnualScopeTotals([]); setScope3Categories([]);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load emissions data for the selected company.');
      setCompanyDetails(null); setChartData([]); setAnnualScopeTotals([]); setScope3Categories([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedCompany?.id) {
      fetchCompanyData(selectedCompany.id);
    } else {
      setCompanyDetails(null); setChartData([]); setAnnualScopeTotals([]); setScope3Categories([]);
    }
  }, [selectedCompany, fetchCompanyData]);

  const handleCompanyChange = (company: CompanySelectItem | null) => {
    setSelectedCompany(company);
  };

  const handleReset = () => {
    setSelectedCompany(null); 
  };

  const pageUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = `Check out emissions data for ${companyDetails?.company_name || 'companies'}!`;

  const allDataForDownload = [
    ...annualScopeTotals.map(item => ({ ...item, dataType: 'Annual Scope Totals' })),
    ...scope3Categories.map(item => ({ ...item, dataType: 'Scope 3 Categories' })),
  ];

  return (
    <div>
      <section className="bg-banner-blue text-banner-text py-8 md:py-12 text-center rounded-lg">
        <h1 className="text-3xl md:text-4xl font-bold">Company Emissions Analysis</h1>
        <div className="mt-4 flex justify-center space-x-3">
          <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(shareText)}`} target="_blank" rel="noopener noreferrer" aria-label="Share on Twitter" className="hover:opacity-80"><Twitter size={24} /></a>
          <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`} target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook" className="hover:opacity-80"><Facebook size={24} /></a>
          <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(pageUrl)}&title=${encodeURIComponent(shareText)}`} target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn" className="hover:opacity-80"><Linkedin size={24} /></a>
        </div>
      </section>

      <CompanySelectorControls
        companies={availableCompanies}
        selectedCompany={selectedCompany}
        onCompanyChange={handleCompanyChange}
        onReset={handleReset}
        isLoading={isLoading && availableCompanies.length === 0} // Show loading only for initial company list
      />
      
      <div className="my-2 p-3 bg-blue-100 dark:bg-sky-900 border-l-4 border-banner-blue text-sm text-blue-700 dark:text-sky-200 rounded-r-md" role="status">
        <p><span className="font-medium">NOTE:</span> Data is illustrative. Implement actual data fetching from your SQLite DB.</p>
      </div>

      {isLoading && <div className="text-center py-10 text-secondary-text-on-slate">Loading company data...</div>}
      {error && <div className="text-center py-10 text-red-500 bg-red-100 dark:bg-red-900 p-4 rounded-md">{error}</div>}
      
      {!isLoading && !error && companyDetails && (
        <>
          <div className="flex justify-end items-center gap-4 mb-4">
            <DataDownloadButton 
              dataToDownload={allDataForDownload} 
              filename={`${companyDetails.company_id}_emissions_data.csv`}
              buttonText="DOWNLOAD COMPANY DATA"
              disabled={allDataForDownload.length === 0}
            />
          </div>
          
          <ChartView 
            data={chartData} 
            chartTitle={`Historical Scope 1 Emissions for ${companyDetails.company_name}`}
            primaryColor="#5DADE2" 
            gridColor="#566573" 
            axisTextColor="#B0BEC5" 
          />
          
          <h3 className="text-xl font-semibold text-primary-text-on-slate mt-6 mb-3">Annual Scope 1, 2, & 3 Total Emissions (Last 5 Avail. Years)</h3>
          {annualScopeTotals.length > 0 ? (
            <EmissionsTable data={annualScopeTotals} title="" />
          ) : <p className="text-secondary-text-on-slate my-4">No annual scope totals data for the selected company in its last 5 reporting years.</p>}

          <h3 className="text-xl font-semibold text-primary-text-on-slate mt-6 mb-3">Scope 3 Category Emissions (Last 5 Avail. Years)</h3>
          {scope3Categories.length > 0 ? (
            <EmissionsTable data={scope3Categories} title="" />
          ) : <p className="text-secondary-text-on-slate my-4">No Scope 3 category data for the selected company in its last 5 reporting years.</p>}
        </>
      )}
      {!companyDetails && !isLoading && !error && (
        <div className="text-center py-10 text-secondary-text-on-slate">Please select a company to view its emissions data.</div>
      )}
    </div>
  );
}
