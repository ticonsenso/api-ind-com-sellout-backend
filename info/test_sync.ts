import { Client } from 'pg';

async function testSync() {
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

    console.log(`Testing sync for ${calculateDate}`);

    const queryWipeAll = `
      UPDATE "db-sellout".consolidated_data_stores 
      SET code_store = NULL
      WHERE calculate_date = $1;
    `;

    const queryUpdateMatches = `
      UPDATE "db-sellout".consolidated_data_stores cds
      SET code_store = t2.code_store_sic
      FROM "db-sellout".sellout_store_master t2
      WHERE 
        REGEXP_REPLACE(TRANSLATE(UPPER(CONCAT(cds.distributor, cds.code_store_distributor)), 'ÁÉÍÓÚÄËÏÖÜÑÃ', 'AEIOUAEIOUNA'), '[^A-Z0-9]', '', 'g') = 
        REGEXP_REPLACE(TRANSLATE(UPPER(t2.search_store), 'ÁÉÍÓÚÄËÏÖÜÑÃ', 'AEIOUAEIOUNA'), '[^A-Z0-9]', '', 'g')
      AND cds.calculate_date = $1
      AND t2.periodo = $1;
    `;

    await client.query(queryWipeAll, [calculateDate]);
    const res = await client.query(queryUpdateMatches, [calculateDate]);
    console.log(`Matched: ${res.rowCount} rows`);

    // Verify specifically for Artefacta Guasmo
    const verify = await client.query(`
        SELECT distributor, code_store_distributor, code_store 
        FROM "db-sellout".consolidated_data_stores 
        WHERE distributor = 'ARTEFACTA' AND code_store_distributor ILIKE '%GUASMO%' AND calculate_date = '2026-03-01'
    `);
    console.log('Result for Artefacta Guasmo:');
    console.log(verify.rows);

  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

testSync();
