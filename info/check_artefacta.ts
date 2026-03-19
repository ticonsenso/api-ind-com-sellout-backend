import { Client } from 'pg';
import * as fs from 'fs';

async function checkArtefacta() {
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
      SELECT search_store, periodo 
      FROM "db-sellout".sellout_store_master 
      WHERE search_store ILIKE '%ARTEFACTA%GUASMO%'
      LIMIT 10;
    `);

    const res2 = await client.query(`
      SELECT distributor, code_store_distributor, calculate_date, code_store
      FROM "db-sellout".consolidated_data_stores
      WHERE distributor = 'ARTEFACTA' AND code_store_distributor ILIKE '%GUASMO%'
      LIMIT 10;
    `);
    
    fs.writeFileSync('c:\\Users\\Jss Montalvan\\Desktop\\CONSENSO\\back\\api-ind-com-sellout-backend\\info\\artefacta_debug.json', JSON.stringify({
        master: res.rows,
        cds: res2.rows
    }, null, 2));

  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

checkArtefacta();
