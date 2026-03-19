import { Client } from 'pg';

async function checkProductMaster() {
  const client = new Client({
    user: 'jpsolanoc',
    host: '82.165.47.88',
    database: 'consenso',
    password: 'holatuten123.',
    port: 5432,
  });

  try {
    await client.connect();
    console.log('Connected to DB');

    const q = `
        SELECT search_product_store, periodo 
        FROM "db-sellout".sellout_product_master 
        WHERE search_product_store ILIKE '%ESPA%'
        LIMIT 5;
    `;
    const res = await client.query(q);
    console.log('--- Search Product Samples ---');
    console.log(JSON.stringify(res.rows, null, 2));

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

checkProductMaster();
