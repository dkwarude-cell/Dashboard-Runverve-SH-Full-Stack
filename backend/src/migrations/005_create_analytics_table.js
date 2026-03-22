/**
 * Migration: 005_create_analytics_table
 * Tracks analytics data for dashboards
 */
export async function up(knex) {
  return knex.schema.createTable('analytics', (table) => {
    table.string('id').primary();
    table.string('user_id').notNullable();
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');

    // Metrics
    table.string('metric_type'); // e.g., 'sessions_completed', 'satisfaction_score', 'risk_trend'
    table.decimal('metric_value', 10, 2);
    table.json('metadata'); // Additional context

    // Date tracking
    table.date('metric_date').notNullable();
    table.datetime('created_at').defaultTo(knex.fn.now());

    // Indexes
    table.index('user_id');
    table.index('metric_date');
    table.index('metric_type');
  });
}

export async function down(knex) {
  return knex.schema.dropTableIfExists('analytics');
}
