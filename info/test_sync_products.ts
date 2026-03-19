import { Client } from 'pg';

async function testSyncProducts() {
  const client = new Client({
    user: 'jpsolanoc',
    host: '82.165.47.88',
    database: 'consenso',
    password: 'holatuten123.',
    port: 5432,
  });

  try {
    await client.connect();
    const calculateDate = '2026-03-01';

    console.log(`Testing product sync for ${calculateDate}`);

    const queryWipeAll = `
      UPDATE "db-sellout".consolidated_data_stores 
      SET code_product = NULL
      WHERE calculate_date = $1;
    `;

    const queryUpdateMatches = `
      UPDATE "db-sellout".consolidated_data_stores cds
      SET code_product = t2.code_product_sic
      FROM "db-sellout".sellout_product_master t2
      WHERE 
        REGEXP_REPLACE(TRANSLATE(UPPER(CONCAT(cds.distributor, cds.code_product_distributor, cds.description_distributor)), 'ÁÉÍÓÚÄËÏÖÜÑÃ', 'AEIOUAEIOUNA'), '[^A-Z0-9]', '', 'g') = 
        REGEXP_REPLACE(TRANSLATE(UPPER(t2.search_product_store), 'ÁÉÍÓÚÄËÏÖÜÑÃ', 'AEIOUAEIOUNA'), '[^A-Z0-9]', '', 'g')
      AND cds.calculate_date = $1
      AND t2.periodo = $1;
    `;

    await client.query(queryWipeAll, [calculateDate]);
    const res = await client.query(queryUpdateMatches, [calculateDate]);
    console.log(`Matched: ${res.rowCount} rows`);

    // Verify specifically for 58TIKGF5UHD
    const verify = await client.query(`
        SELECT distributor, code_product_distributor, description_distributor, code_product 
        FROM "db-sellout".consolidated_data_stores 
        WHERE description_distributor ILIKE '%58TIKGF5UHD%' AND calculate_date = '2026-03-01'
        LIMIT 5;
    `);
    console.log('Result for 58TIKGF5UHD:');
    console.log(verify.rows);

    // Also check for Motorola 43
    const verify2 = await client.query(`
        SELECT distributor, code_product_distributor, description_distributor, code_product
        FROM "db-sellout".consolidated_data_stores 
        WHERE description_distributor ILIKE '%43MKGFHD%' AND calculate_date = '2026-03-01'
        LIMIT 5;
    `);
    console.log('Result for 43MKGFHD Motorola:');
    console.log(verify2.rows);

  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

testSyncProducts();
