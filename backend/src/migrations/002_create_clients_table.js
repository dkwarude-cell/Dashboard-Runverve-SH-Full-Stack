/**
 * Migration: 002_create_clients_table
 * Creates clients table with user profile information
 */
export async function up(knex) {
  return knex.schema.createTable('clients', (table) => {
    table.string('id').primary();
    table.string('user_id').notNullable().unique();
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');

    // Client profile data
    table.string('diagnosis');
    table.text('medical_history');
    table.string('emergency_contact_name');
    table.string('emergency_contact_phone');
    table.string('session_preference').defaultTo('weekly');
    table.integer('session_duration_minutes').defaultTo(60);
    table.string('timezone');

    // Tracking
    table.integer('total_sessions').defaultTo(0);
    table.integer('completed_sessions').defaultTo(0);
    table.datetime('last_session_date');
    table.decimal('risk_score', 5, 2).defaultTo(0);

    // Timestamps
    table.datetime('created_at').defaultTo(knex.fn.now());
    table.datetime('updated_at').defaultTo(knex.fn.now());

    // Indexes
    table.index('user_id');
    table.index('created_at');
  });
}

export async function down(knex) {
  return knex.schema.dropTableIfExists('clients');
}
