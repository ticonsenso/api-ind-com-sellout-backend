import { DataSource } from 'typeorm';
import * as fs from 'fs';

const dataSource = new DataSource({
    type: "postgres",
    host: "82.165.47.88",
    port: 5432,
    username: "jpsolanoc",
    password: "holatuten123.",
    database: "consenso",
    schema: "db-sellout",
    ssl: false
});

async function main() {
    await dataSource.initialize();
    
    // Check if the MASTER has '#' in search_product_store
    const masterResult = await dataSource.query(`
      SELECT id, search_product_store, product_store, code_product_sic, periodo
      FROM "db-sellout".sellout_product_master
      WHERE product_store ILIKE '%#%'
      LIMIT 5;
    `);

    // Check if the CONSOLIDATED specifically has '#' and what's in observation
    const cdsResult = await dataSource.query(`
      SELECT id, distributor, description_distributor, observation, code_product
      FROM "db-sellout".consolidated_data_stores
      WHERE description_distributor ILIKE '%#%'
      LIMIT 10;
    `);

    fs.writeFileSync('info/check_hash_symbol.json', JSON.stringify({
        masterWithHash: masterResult,
        consolidatedWithHash: cdsResult
    }, null, 2));

    await dataSource.destroy();
}

main().catch(console.error);
