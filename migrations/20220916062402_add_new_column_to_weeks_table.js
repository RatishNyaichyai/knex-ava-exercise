/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.alterTable('weeks', (t) => {
        t.integer('instructor_id').notNullable().references('instructors.id');
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.alterTable('weeks', (t) => {
        t.dropColumn('instructor_id');
    })

};
