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
    
    const result = await dataSource.query(`
      SELECT distributor, code_product_distributor, description_distributor, observation
      FROM "db-sellout".consolidated_data_stores
      WHERE distributor ILIKE '%BOYAC%' AND observation IS NOT NULL
      LIMIT 5;
    `);

    fs.writeFileSync('info/boyaca_cds.json', JSON.stringify(result, null, 2));

    await dataSource.destroy();
}

main().catch(console.error);
