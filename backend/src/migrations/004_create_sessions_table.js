/**
 * Migration: 004_create_sessions_table
 * Creates sessions table for tracking therapy sessions
 */
export async function up(knex) {
  return knex.schema.createTable('sessions', (table) => {
    table.string('id').primary();
    table.string('client_id').notNullable();
    table.string('therapist_id').notNullable();
    table.foreign('client_id').references('id').inTable('clients').onDelete('CASCADE');
    table.foreign('therapist_id').references('id').inTable('therapists').onDelete('CASCADE');

    // Status tracking
    table.string('status').defaultTo('scheduled');
    table.datetime('session_datetime').notNullable();
    table.integer('duration_minutes').defaultTo(60);

    // Session details
    table.text('notes');
    table.decimal('client_rating', 3, 2);
    table.text('client_feedback');
    table.json('session_data'); // Additional session-specific data

    // Progress tracking
    table.decimal('risk_score_before', 5, 2);
    table.decimal('risk_score_after', 5, 2);
    table.string('progress_category');
    table.text('progress_notes');

    // Timestamps
    table.datetime('created_at').defaultTo(knex.fn.now());
    table.datetime('updated_at').defaultTo(knex.fn.now());

    // Indexes
    table.index('client_id');
    table.index('therapist_id');
    table.index('status');
    table.index('session_datetime');
  });
}

export async function down(knex) {
  return knex.schema.dropTableIfExists('sessions');
}
