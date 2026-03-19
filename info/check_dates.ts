import { Client } from 'pg';

async function checkCDSData() {
  const client = new Client({
    user: 'jpsolanoc',
    host: '82.165.47.88',
    database: 'consenso',
    password: 'holatuten123.',
    port: 5432,
  });

  try {
    await client.connect();
    const res = await client.query(`
      SELECT calculate_date, count(*) 
      FROM "db-sellout".consolidated_data_stores 
      GROUP BY calculate_date 
      ORDER BY calculate_date DESC 
      LIMIT 10;
    `);
    console.log('--- CDS Calculate Dates ---');
    console.log(res.rows);

  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

checkCDSData();
