import { Client } from 'pg';

async function checkEmily() {
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
      SELECT distributor, code_product_distributor, description_distributor, code_product 
      FROM "db-sellout".consolidated_data_stores 
      WHERE distributor = 'ALMACEN EMILY' AND calculate_date = '2026-03-01'
      LIMIT 10;
    `);
    console.log('--- Results for ALMACEN EMILY ---');
    console.log(JSON.stringify(res.rows, null, 2));

    const resMaster = await client.query(`
      SELECT search_product_store, code_product_sic
      FROM "db-sellout".sellout_product_master
      WHERE search_product_store ILIKE '%EMILY%' AND periodo = '2026-03-01'
      LIMIT 5;
    `);
    console.log('\n--- Master for ALMACEN EMILY ---');
    console.log(JSON.stringify(resMaster.rows, null, 2));

  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

checkEmily();
