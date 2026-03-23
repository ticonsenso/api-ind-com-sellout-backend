import { DataSource } from 'typeorm';

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
      SELECT REGEXP_REPLACE(UPPER('ALMACENES BOYACÁ 101122 CAMPANA EXTRACTORA CEI-75CRP A'), '\\s+', '', 'g') as s1,
             REGEXP_REPLACE(UPPER('ALMACENES BOYACÁ 101122 CAMPANA EXTRACTORA CEI-75CRP A'), '[^A-Z0-9]', '', 'g') as s2
    `);

    console.log(result);

    await dataSource.destroy();
}

main().catch(console.error);
