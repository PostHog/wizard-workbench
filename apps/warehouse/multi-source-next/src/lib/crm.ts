import { Client } from '@hubspot/api-client';

/**
 * HubSpot is the account-owner lookup: which CSM owns the company a ticket
 * came from. Read-only from this app — nothing writes back.
 */
export const hubspot = new Client({
  accessToken: process.env.HUBSPOT_ACCESS_TOKEN,
});

export async function ownerForDomain(domain: string) {
  const search = await hubspot.crm.companies.searchApi.doSearch({
    filterGroups: [
      {
        filters: [{ propertyName: 'domain', operator: 'EQ', value: domain }],
      },
    ],
    properties: ['name', 'hubspot_owner_id', 'hs_lead_status'],
    limit: 1,
  });
  return search.results[0]?.properties ?? null;
}
