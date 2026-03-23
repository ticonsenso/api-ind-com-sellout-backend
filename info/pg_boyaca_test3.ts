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
    
    // Just select what the observation WILL be populated as during wipe
    const result = await dataSource.query(`
      SELECT distributor, code_product_distributor, description_distributor,
        REGEXP_REPLACE(UPPER(CONCAT(distributor, code_product_distributor, description_distributor)), '\\s+', '', 'g') as what_will_be_saved
      FROM "db-sellout".consolidated_data_stores
      WHERE code_product_distributor = '101122'
      LIMIT 1;
    `);

    fs.writeFileSync('info/boyaca_what_will_save.json', JSON.stringify(result, null, 2));

    await dataSource.destroy();
}

main().catch(console.error);
