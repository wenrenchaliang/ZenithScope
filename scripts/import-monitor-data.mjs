import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config({ quiet: true });

const projectRoot = process.cwd();
const dataDir = path.join(projectRoot, 'data');
const schemaPath = path.join(projectRoot, 'database', 'schema.sql');

const dbConfig = {
  host: process.env.DB_HOST ?? '127.0.0.1',
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER ?? 'root',
  password: process.env.DB_PASSWORD ?? '123456',
  database: process.env.DB_NAME ?? 'zenithscope',
  charset: 'utf8mb4',
  timezone: '+08:00',
};

function splitTsvLine(line) {
  return line.split('\t').map((value) => value.trim());
}

async function readTsv(fileName) {
  const content = await fs.readFile(path.join(dataDir, fileName), 'utf8');
  const [headerLine, ...lines] = content.trim().split(/\r?\n/);
  const headers = splitTsvLine(headerLine);

  return lines
    .filter(Boolean)
    .map((line) => {
      const values = splitTsvLine(line);
      return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? '']));
    });
}

function toChinaDateParts(tsMs) {
  const chinaDate = new Date(Number(tsMs) + 8 * 60 * 60 * 1000);
  const year = chinaDate.getUTCFullYear();
  const month = chinaDate.getUTCMonth() + 1;
  const day = chinaDate.getUTCDate();
  const hour = chinaDate.getUTCHours();
  const minute = chinaDate.getUTCMinutes();
  const second = chinaDate.getUTCSeconds();
  const pad = (value) => String(value).padStart(2, '0');

  return {
    collectedAt: `${year}-${pad(month)}-${pad(day)} ${pad(hour)}:${pad(minute)}:${pad(second)}`,
    collectedDate: `${year}-${pad(month)}-${pad(day)}`,
    year,
    month,
    day,
  };
}

async function executeSchema() {
  const connection = await mysql.createConnection({
    ...dbConfig,
    database: undefined,
    multipleStatements: true,
  });

  try {
    const schema = await fs.readFile(schemaPath, 'utf8');
    await connection.query(schema);
  } finally {
    await connection.end();
  }
}

async function insertBatches(connection, sql, rows, batchSize = 1000) {
  for (let index = 0; index < rows.length; index += batchSize) {
    const batch = rows.slice(index, index + batchSize);
    await connection.query(sql, [batch]);
  }
}

function toMetricRows(records) {
  return records.map((record) => {
    const dateParts = toChinaDateParts(record.ts);
    return [
      Number(record.ts),
      dateParts.collectedAt,
      dateParts.collectedDate,
      dateParts.year,
      dateParts.month,
      dateParts.day,
      record.hostid,
      record.type,
      record.mod,
      Number(record.value),
      record.tag,
    ];
  });
}

async function main() {
  await executeSchema();

  const connection = await mysql.createConnection(dbConfig);

  try {
    const [hosts, metricDefs, prefRecords, diskRecords] = await Promise.all([
      readTsv('host_detail.dat'),
      readTsv('mod_detail.dat'),
      readTsv('pref_tsar.dat'),
      readTsv('disk_tsar.dat'),
    ]);

    await connection.beginTransaction();

    await connection.query('SET FOREIGN_KEY_CHECKS = 0');
    await connection.query('TRUNCATE TABLE daily_metric_summary');
    await connection.query('TRUNCATE TABLE tsar_metrics');
    await connection.query('TRUNCATE TABLE metric_defs');
    await connection.query('TRUNCATE TABLE hosts');
    await connection.query('SET FOREIGN_KEY_CHECKS = 1');

    await insertBatches(
      connection,
      'INSERT INTO hosts (hostid, hostname, owner, model, location1, location2) VALUES ?',
      hosts.map((host) => [
        host.hostid,
        host.hostname,
        host.owner,
        host.model,
        host.location1,
        host.location2,
      ]),
    );

    await insertBatches(
      connection,
      'INSERT INTO metric_defs (metric_mod, metric_type, description, unit, tag) VALUES ?',
      metricDefs.map((metric) => [metric.mod, metric.type, metric.desc, metric.unit, metric.tag]),
    );

    const metricRows = [...toMetricRows(prefRecords), ...toMetricRows(diskRecords)];
    await insertBatches(
      connection,
      `INSERT INTO tsar_metrics
        (ts_ms, collected_at, collected_date, collected_year, collected_month, collected_day,
         hostid, metric_type, metric_mod, value, tag)
       VALUES ?`,
      metricRows,
      2000,
    );

    await connection.query(`
      INSERT INTO daily_metric_summary (
        collected_date,
        collected_year,
        collected_month,
        collected_day,
        hostid,
        metric_type,
        metric_mod,
        tag,
        avg_value,
        max_value,
        sample_count
      )
      SELECT
        collected_date,
        collected_year,
        collected_month,
        collected_day,
        hostid,
        metric_type,
        metric_mod,
        tag,
        AVG(value),
        MAX(value),
        COUNT(*)
      FROM tsar_metrics
      GROUP BY
        collected_date,
        collected_year,
        collected_month,
        collected_day,
        hostid,
        metric_type,
        metric_mod,
        tag
    `);

    await connection.commit();

    const [[counts]] = await connection.query(`
      SELECT
        (SELECT COUNT(*) FROM hosts) AS hosts,
        (SELECT COUNT(*) FROM metric_defs) AS metricDefs,
        (SELECT COUNT(*) FROM tsar_metrics) AS metrics,
        (SELECT COUNT(*) FROM daily_metric_summary) AS dailyRows,
        (SELECT MIN(collected_date) FROM tsar_metrics) AS minDate,
        (SELECT MAX(collected_date) FROM tsar_metrics) AS maxDate
    `);

    console.log('Import complete:', counts);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    await connection.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
