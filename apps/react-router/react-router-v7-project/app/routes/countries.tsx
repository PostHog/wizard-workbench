import { Link } from "react-router";
import type { Route } from "./+types/countries";
import { useState } from "react";
import { usePostHog } from "@posthog/react";
import { useAuth } from "~/context/AuthContext";
import { claimCountry, likeCountry, visitCountry } from "~/lib/utils/auth";

export async function clientLoader() {
  try {
    // REST Countries API v3.1 requires fields parameter
    // Request only the fields we need to reduce payload size
    const res = await fetch(
      "https://restcountries.com/v3.1/all?fields=name,region,population,cca3,flags"
    );
    if (!res.ok) {
      throw new Error(`Failed to fetch countries: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    
    // Check if API returned an error object
    if (data.status === 404 || (data.message && !Array.isArray(data))) {
      console.error("API Error:", data.message || data.status);
      return [];
    }
    
    // Ensure we return an array
    const countries = Array.isArray(data) ? data : [];
    console.log(`Loaded ${countries.length} countries from API`);
    return countries;
  } catch (error) {
    console.error("Error loading countries:", error);
    // Return empty array on error to prevent crashes
    return [];
  }
}

export default function Countries({ loaderData }: Route.ComponentProps) {
  const posthog = usePostHog();
  const { user } = useAuth();
  const [search, setSearch] = useState<string>("");
  const [region, setRegion] = useState<string>("");

  // Handler for search input with debounced analytics
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearch = e.target.value;
    setSearch(newSearch);

    // Capture search event when user types a meaningful search (3+ chars)
    if (newSearch.length >= 3) {
      posthog?.capture('countries_searched', {
        search_term: newSearch,
      });
    }
  };

  // Handler for region filter
  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRegion = e.target.value;
    setRegion(newRegion);

    // Capture region filter event
    if (newRegion) {
      posthog?.capture('region_filtered', {
        region: newRegion,
      });
    }
  };

  // Ensure loaderData is an array, fallback to empty array
  const countries = Array.isArray(loaderData) ? loaderData : [];

  const filteredCountries = countries.filter((country: any) => {
    // Handle cases where country or country.name might be undefined
    if (!country || !country.name || !country.name.common) {
      return false;
    }

    const matchesRegion =
      !region || (country.region && country.region.toLowerCase() === region.toLowerCase());
    const matchesSearch =
      !search ||
      country.name.common.toLowerCase().includes(search.toLowerCase());
    return matchesSearch && matchesRegion;
  });

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Countries</h2>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={handleSearchChange}
          className="border border-gray-300 rounded px-3 py-2 w-full sm:w-1/2 focus:outline-none focus:border-indigo-500"
        />
        <select
          value={region}
          onChange={handleRegionChange}
          className="border border-gray-300 rounded px-3 py-2 w-full sm:w-1/2 focus:outline-none focus:border-indigo-500"
        >
          <option value="">All Regions</option>
          <option value="africa">Africa</option>
          <option value="americas">Americas</option>
          <option value="asia">Asia</option>
          <option value="europe">Europe</option>
          <option value="oceania">Oceania</option>
        </select>
      </div>

      {countries.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-2">Loading countries...</p>
          <p className="text-sm text-gray-500">If this persists, check the browser console for errors.</p>
        </div>
      ) : filteredCountries.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No countries match your filters.</p>
          <p className="text-sm text-gray-500 mt-2">
            Showing {countries.length} total countries available.
          </p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredCountries.map((country: any) => {
            const countryName = country.name.common;
            const isClaimed = user?.claimedCountries.includes(countryName);
            const isLiked = user?.likedCountries.includes(countryName);
            
            return (
              <li
                key={country.cca3}
                className={`bg-white border rounded-xl p-4 shadow hover:shadow-lg transition ${
                  isClaimed ? 'border-yellow-400 border-2 bg-yellow-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <Link
                    to={`/countries/${countryName}`}
                    className="text-indigo-600 hover:underline text-lg font-semibold flex-1"
                  >
                    {countryName}
                    {isClaimed && <span className="ml-2 text-yellow-600">👑</span>}
                  </Link>
                </div>
                
                <div className="text-gray-600 text-sm mb-3">
                  Region: {country.region} <br />
                  Population: {country.population.toLocaleString()}
                </div>

                {user ? (
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => {
                        claimCountry(countryName);
                        window.location.reload();
                      }}
                      className={`flex-1 px-3 py-2 text-xs rounded-lg font-medium transition ${
                        isClaimed
                          ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                          : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                      }`}
                    >
                      {isClaimed ? '👑 Claimed' : '🏴 Claim'}
                    </button>
                    <button
                      onClick={() => {
                        likeCountry(countryName);
                        window.location.reload();
                      }}
                      className={`px-3 py-2 text-xs rounded-lg font-medium transition ${
                        isLiked
                          ? 'bg-red-100 text-red-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {isLiked ? '❤️' : '🤍'}
                    </button>
                    <button
                      onClick={() => {
                        visitCountry(countryName);
                        window.location.reload();
                      }}
                      className="px-3 py-2 text-xs rounded-lg font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
                    >
                      ✈️
                    </button>
                  </div>
                ) : (
                  <div className="mt-3 text-xs text-gray-500 text-center">
                    <Link to="/login" className="text-indigo-600 hover:underline">
                      Login to claim countries!
                    </Link>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
