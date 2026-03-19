import { Client } from 'pg';

async function checkSamples() {
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

    // Sample 1: Store from Artefacta (missing Match in my script)
    const storeQuery = `
      SELECT search_store, periodo 
      FROM "db-sellout".sellout_store_master 
      WHERE UPPER(search_store) LIKE '%GUASMO%'
      LIMIT 10;
    `;
    const storeRes = await client.query(storeQuery);
    console.log('\n--- Store Master Samples (GUASMO) ---');
    console.log(storeRes.rows);

    // Sample 2: Product from ESPAÑA
    const productQuery = `
      SELECT search_product_store, periodo
      FROM "db-sellout".sellout_product_master
      WHERE UPPER(search_product_store) LIKE '%58TIKGF5UHD%'
      LIMIT 10;
    `;
    const productRes = await client.query(productQuery);
    console.log('\n--- Product Master Samples (58TIKGF5UHD) ---');
    console.log(productRes.rows);

    // Check a concrete concatenation if we can
    const checkConcat = `
        SELECT 
            REGEXP_REPLACE(TRANSLATE(UPPER('ESPAÑA'), 'ÁÉÍÓÚÄËÏÖÜÑÃ', 'AEIOUAEIOUNA'), '[^A-Z0-9]', '', 'g') as test_espana
    `;
    const testRes = await client.query(checkConcat);
    console.log('\n--- Test Clean logic ---');
    console.log(testRes.rows);

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

checkSamples();
