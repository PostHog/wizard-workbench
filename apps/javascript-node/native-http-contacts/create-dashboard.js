import https from 'https';

const POSTHOG_API_KEY = process.env.POSTHOG_PERSONAL_API_KEY;
const PROJECT_ID = '238460';
const API_HOST = 'us.posthog.com';

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: API_HOST,
      port: 443,
      path: `/api/projects/${PROJECT_ID}${path}`,
      method: method,
      headers: {
        'Authorization': `Bearer ${POSTHOG_API_KEY}`,
        'Content-Type': 'application/json',
      }
    };

    const req = https.request(options, (res) => {
      let body = '';

      res.on('data', (chunk) => {
        body += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(response);
          } else {
            reject(new Error(`API Error ${res.statusCode}: ${JSON.stringify(response)}`));
          }
        } catch (e) {
          reject(new Error(`Failed to parse response: ${body}`));
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function createDashboard() {
  console.log('Creating dashboard...');
  const dashboard = await makeRequest('POST', '/dashboards/', {
    name: 'Analytics basics',
    description: 'Core analytics dashboard for the native HTTP contacts API - tracking contact lifecycle, group creation, and churn signals.',
    pinned: false
  });
  console.log(`Dashboard created with ID: ${dashboard.id}`);
  console.log(`Dashboard URL: https://${API_HOST}/project/${PROJECT_ID}/dashboard/${dashboard.id}`);
  return dashboard;
}

async function createInsight(name, query, dashboardId) {
  console.log(`Creating insight: ${name}...`);
  const insight = await makeRequest('POST', '/insights/', {
    name: name,
    query: query,
    dashboards: [dashboardId]
  });
  console.log(`Insight created: ${name} (ID: ${insight.short_id})`);
  console.log(`Insight URL: https://${API_HOST}/project/${PROJECT_ID}/insights/${insight.short_id}`);
  return insight;
}

async function main() {
  try {
    // Step 1: Create dashboard
    const dashboard = await createDashboard();

    console.log('\n--- Creating Insights ---\n');

    // Step 2a: Contact Creation Over Time (Trends)
    await createInsight(
      'Contact Creation Over Time',
      {
        kind: 'TrendsQuery',
        series: [
          {
            kind: 'EventsNode',
            event: 'contact_created',
            name: 'contact_created',
            math: 'total'
          }
        ],
        interval: 'day',
        dateRange: {
          date_from: '-30d'
        }
      },
      dashboard.id
    );

    // Step 2b: Contact Lifecycle Funnel
    await createInsight(
      'Contact Lifecycle Funnel',
      {
        kind: 'FunnelsQuery',
        series: [
          {
            kind: 'EventsNode',
            event: 'contact_created',
            name: 'contact_created'
          },
          {
            kind: 'EventsNode',
            event: 'contact_updated',
            name: 'contact_updated'
          },
          {
            kind: 'EventsNode',
            event: 'contact_deleted',
            name: 'contact_deleted'
          }
        ],
        dateRange: {
          date_from: '-30d'
        },
        funnelsFilter: {
          funnelWindowInterval: 14,
          funnelWindowIntervalUnit: 'day'
        }
      },
      dashboard.id
    );

    // Step 2c: Contact Churn Rate (Trends)
    await createInsight(
      'Contact Churn Rate',
      {
        kind: 'TrendsQuery',
        series: [
          {
            kind: 'EventsNode',
            event: 'contact_deleted',
            name: 'contact_deleted',
            math: 'total'
          }
        ],
        interval: 'day',
        dateRange: {
          date_from: '-30d'
        }
      },
      dashboard.id
    );

    // Step 2d: Group Creation Over Time (Trends)
    await createInsight(
      'Group Creation Over Time',
      {
        kind: 'TrendsQuery',
        series: [
          {
            kind: 'EventsNode',
            event: 'group_created',
            name: 'group_created',
            math: 'total'
          }
        ],
        interval: 'day',
        dateRange: {
          date_from: '-30d'
        }
      },
      dashboard.id
    );

    // Step 2e: Contact Actions Breakdown (Trends)
    await createInsight(
      'Contact Actions Breakdown',
      {
        kind: 'TrendsQuery',
        series: [
          {
            kind: 'EventsNode',
            event: 'contact_created',
            name: 'contact_created',
            math: 'total'
          },
          {
            kind: 'EventsNode',
            event: 'contact_updated',
            name: 'contact_updated',
            math: 'total'
          },
          {
            kind: 'EventsNode',
            event: 'contact_deleted',
            name: 'contact_deleted',
            math: 'total'
          }
        ],
        interval: 'day',
        dateRange: {
          date_from: '-30d'
        }
      },
      dashboard.id
    );

    console.log('\n=== All insights created successfully! ===\n');
    console.log(`Dashboard URL: https://${API_HOST}/project/${PROJECT_ID}/dashboard/${dashboard.id}`);

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
