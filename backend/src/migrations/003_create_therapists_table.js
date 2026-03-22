/**
 * Migration: 003_create_therapists_table
 * Creates therapists table with specialization and rating info
 */
export async function up(knex) {
  return knex.schema.createTable('therapists', (table) => {
    table.string('id').primary();
    table.string('user_id').notNullable().unique();
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');

    // Professional info
    table.string('license_number').notNullable();
    table.string('specialization');
    table.text('certifications');
    table.integer('years_of_experience').defaultTo(0);

    // Rating and reviews
    table.decimal('average_rating', 3, 2).defaultTo(0);
    table.integer('total_reviews').defaultTo(0);
    table.integer('total_sessions').defaultTo(0);

    // Availability
    table.json('available_hours'); // e.g., {"monday": [9,10,14,15...], "tuesday": [...]}
    table.boolean('accepting_new_clients').defaultTo(true);
    table.integer('max_clients').defaultTo(20);
    table.integer('current_clients').defaultTo(0);

    // Timestamps
    table.datetime('created_at').defaultTo(knex.fn.now());
    table.datetime('updated_at').defaultTo(knex.fn.now());

    // Indexes
    table.index('user_id');
    table.index('specialization');
    table.index('average_rating');
  });
}

export async function down(knex) {
  return knex.schema.dropTableIfExists('therapists');
}
