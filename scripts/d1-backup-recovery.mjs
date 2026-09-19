#!/usr/bin/env node
/**
 * Behdoon Platform - D1 Backup, Recovery & Disaster Recovery Utility
 *
 * Capabilities:
 *  1. Full database schema & data dump to portable SQL / JSON formats.
 *  2. Data integrity & record count verification across all platform tables.
 *  3. In-memory restoration dry-run & validation test.
 *  4. Production D1 Cloudflare command-line instructions.
 */

import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';

const CORE_TABLES = [
  'settings',
  'customers',
  'customer_addresses',
  'customer_otps',
  'providers',
  'requests',
  'request_candidates',
  'quotes',
  'provider_schedules',
  'invoices',
  'payments',
  'provider_settlements',
  'ratings',
  'disputes',
  'support_tickets',
  'support_ticket_messages',
  'notifications',
  'commission_rules',
  'financial_ledger',
  'idempotency_keys',
  'admin_users',
  'admin_audit_logs',
  'rate_limits',
];

/**
 * Dump database contents to a structured backup object
 */
export function dumpDatabase(db) {
  const backup = {
    version: '1.0',
    platform: 'Behdoon Home Services Platform',
    timestamp: new Date().toISOString(),
    tables: {},
    schema: [],
  };

  // 1. Fetch schemas
  const schemaRows = db.prepare(
    "SELECT type, name, tbl_name, sql FROM sqlite_master WHERE sql IS NOT NULL AND name NOT LIKE 'sqlite_%' ORDER BY type = 'table' DESC, name ASC"
  ).all();
  backup.schema = schemaRows;

  // 2. Fetch data from each core table
  for (const tableName of CORE_TABLES) {
    try {
      // Check if table exists
      const exists = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name=?").get(tableName);
      if (!exists) continue;

      const countRow = db.prepare(`SELECT COUNT(*) as c FROM ${tableName}`).get();
      const rows = db.prepare(`SELECT * FROM ${tableName}`).all();
      backup.tables[tableName] = {
        rowCount: countRow ? Number(countRow.c) : 0,
        rows,
      };
    } catch (err) {
      backup.tables[tableName] = {
        error: err.message,
        rowCount: 0,
        rows: [],
      };
    }
  }

  return backup;
}

/**
 * Generate SQL dump script from backup object
 */
export function generateSqlDump(backup) {
  const lines = [
    '-- ==============================================================',
    `-- Behdoon D1 Backup Dump - ${backup.timestamp}`,
    '-- ==============================================================',
    'PRAGMA foreign_keys = OFF;',
    'BEGIN TRANSACTION;',
    '',
  ];

  for (const schemaItem of backup.schema) {
    if (schemaItem.type === 'table') {
      lines.push(`${schemaItem.sql};`);
    }
  }

  for (const [tableName, data] of Object.entries(backup.tables)) {
    if (!data.rows || data.rows.length === 0) continue;
    lines.push(`\n-- Table: ${tableName} (${data.rows.length} rows)`);

    for (const row of data.rows) {
      const keys = Object.keys(row);
      const cols = keys.map((k) => `"${k}"`).join(', ');
      const vals = keys.map((k) => {
        const val = row[k];
        if (val === null || val === undefined) return 'NULL';
        if (typeof val === 'number') return val;
        return `'${String(val).replace(/'/g, "''")}'`;
      }).join(', ');
      lines.push(`INSERT OR REPLACE INTO "${tableName}" (${cols}) VALUES (${vals});`);
    }
  }

  for (const schemaItem of backup.schema) {
    if (schemaItem.type === 'index' && schemaItem.sql) {
      lines.push(`${schemaItem.sql};`);
    }
  }

  lines.push('');
  lines.push('COMMIT;');
  lines.push('PRAGMA foreign_keys = ON;');
  return lines.join('\n');
}

/**
 * Simulate restoration of backup into a fresh database and verify record integrity
 */
export function simulateRestore(backup) {
  const targetDb = new DatabaseSync(':memory:');
  const sql = generateSqlDump(backup);

  // Execute restore script
  targetDb.exec(sql);

  // Verify counts
  const verification = {
    restoredSuccessfully: true,
    tableResults: {},
  };

  for (const [tableName, data] of Object.entries(backup.tables)) {
    try {
      const row = targetDb.prepare(`SELECT COUNT(*) as c FROM "${tableName}"`).get();
      const targetCount = row ? Number(row.c) : 0;
      const match = targetCount === data.rowCount;
      verification.tableResults[tableName] = {
        sourceCount: data.rowCount,
        restoredCount: targetCount,
        matches: match,
      };
      if (!match) verification.restoredSuccessfully = false;
    } catch (err) {
      verification.tableResults[tableName] = {
        error: err.message,
        matches: false,
      };
      verification.restoredSuccessfully = false;
    }
  }

  return verification;
}

// CLI Execution & Self-Test
if (process.argv[1] && process.argv[1].endsWith('d1-backup-recovery.mjs')) {
  console.log('=================================================================');
  console.log('--- Behdoon D1 Database Backup & Disaster Recovery Test Utility ---');
  console.log('=================================================================\n');

  // Create a populated sample test database
  const sampleDb = new DatabaseSync(':memory:');
  const schema2Path = path.resolve(process.cwd(), 'schema_v2.sql');
  if (fs.existsSync(schema2Path)) {
    sampleDb.exec(fs.readFileSync(schema2Path, 'utf8'));
  }
  const schema3Path = path.resolve(process.cwd(), 'schema_v3.sql');
  if (fs.existsSync(schema3Path)) {
    sampleDb.exec(fs.readFileSync(schema3Path, 'utf8'));
  }

  // Populate sample test records
  const now = new Date().toISOString();
  sampleDb.exec(`
    CREATE TABLE IF NOT EXISTS rate_limits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT UNIQUE NOT NULL,
      attempts INTEGER DEFAULT 0,
      window_start INTEGER NOT NULL,
      locked_until INTEGER DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      full_name TEXT NOT NULL,
      role TEXT NOT NULL,
      permissions TEXT,
      phone TEXT,
      token TEXT UNIQUE,
      is_active INTEGER DEFAULT 1,
      created_at TEXT,
      updated_at TEXT
    );
    CREATE TABLE IF NOT EXISTS admin_audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      actor TEXT NOT NULL,
      actor_role TEXT NOT NULL,
      action TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      entity_id TEXT NOT NULL,
      before_state TEXT,
      after_state TEXT,
      reason TEXT,
      ip_address TEXT,
      metadata TEXT,
      created_at TEXT NOT NULL
    );

    INSERT INTO customers (id, phone, full_name, created_at, updated_at) VALUES (1, '09121112233', 'تست پشتیبان‌گیری', '${now}', '${now}');
    INSERT INTO providers (id, full_name, phone, service_categories, created_at, updated_at) VALUES (1, 'تکنسین بهدون', '09123334455', '["plumbing"]', '${now}', '${now}');
    INSERT INTO requests (id, tracking_code, customer_id, name, phone, service_id, service_label, status, created_at, updated_at) VALUES (1, 'BD-2026-000001', 1, 'تست', '09121112233', 'plumbing', 'تاسیسات', 'completed', '${now}', '${now}');
    INSERT INTO financial_ledger (order_id, entry_type, amount, direction, created_at) VALUES (1, 'payment', 500000, 'credit', '${now}');
  `);

  console.log('[1] Executing Database Export Dump...');
  const backup = dumpDatabase(sampleDb);
  const tableCount = Object.keys(backup.tables).length;
  console.log(`✅ Dumped ${backup.schema.length} schema definitions and ${tableCount} registered tables.`);

  console.log('\n[2] Generating Standalone SQL Restoration Script...');
  const sqlDump = generateSqlDump(backup);
  console.log(`✅ Generated SQL dump script (${sqlDump.length} bytes).`);

  console.log('\n[3] Running Disaster Recovery In-Memory Restoration Dry-Run...');
  const verification = simulateRestore(backup);

  if (verification.restoredSuccessfully) {
    console.log('✅ PASS: Restoration dry-run verified successfully. All record counts match 100%.');
    console.log('\nRestored Table Summary:');
    for (const [table, stats] of Object.entries(verification.tableResults)) {
      if (stats.sourceCount > 0) {
        console.log(`  - ${table}: ${stats.restoredCount} rows restored [OK]`);
      }
    }
  } else {
    console.error('❌ FAIL: Restoration dry-run verification failed!');
    console.error(JSON.stringify(verification, null, 2));
    process.exit(1);
  }

  console.log('\n[4] Production Disaster Recovery Runbook:');
  console.log('  1. Automated Weekly / Daily Cloudflare D1 Export:');
  console.log('     $ npx wrangler d1 export behdoon-db --remote --output=./backups/d1-$(date +%F).sql');
  console.log('  2. Full Restoration from Backup:');
  console.log('     $ npx wrangler d1 execute behdoon-db --remote --file=./backups/d1-YYYY-MM-DD.sql');
  console.log('  3. Local Staging Replication:');
  console.log('     $ npx wrangler d1 execute behdoon-db --local --file=./backups/d1-YYYY-MM-DD.sql\n');
  console.log('=================================================================');
  console.log('--- Backup & Recovery Verification: 100% PASSED ---');
  console.log('=================================================================');
}
