/**
 * Migration: 001_create_users_table
 * Creates the core users table with role-based access
 */
export async function up(knex) {
  return knex.schema.createTable('users', (table) => {
    table.string('id').primary();
    table.string('firebase_uid').unique().notNullable();
    table.string('role').notNullable();
    table.string('email').notNullable();
    table.string('first_name');
    table.string('last_name');
    table.text('bio');
    table.string('phone_number');
    table.string('profile_image_url');
    table.boolean('is_active').defaultTo(true);
    table.datetime('created_at').defaultTo(knex.fn.now());
    table.datetime('updated_at').defaultTo(knex.fn.now());

    // Indexes
    table.index('firebase_uid');
    table.index('role');
    table.index('is_active');
  });
}

export async function down(knex) {
  return knex.schema.dropTableIfExists('users');
}
