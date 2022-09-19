const { knex } = require('../../database')

const INSTRUCTOR_TABLE_NAME = 'instructors';

/**
 * 
 * @param {integer} id 
 * @param {string} instructor_name 
 * @returns 
 */
function insertInstructor(id, instructor_name) {
    return knex(INSTRUCTOR_TABLE_NAME).insert({ id: id, name: instructor_name }).returning('*')
}

function insertInstructors(names) {
    return knex(INSTRUCTOR_TABLE_NAME).insert(names).returning('*');
}

function searchInstructorById(id) {
    return knex(INSTRUCTOR_TABLE_NAME).returning('*').where({ id });
}

function updateInstructorById(id, updatedData) {
    return knex(INSTRUCTOR_TABLE_NAME).where({ id }).update(updatedData).returning('*');
}

function deleteInstructorById(id) {
    return knex(INSTRUCTOR_TABLE_NAME).where({ id }).del().returning('*')
}

module.exports = {
    INSTRUCTOR_TABLE_NAME,
    insertInstructor,
    insertInstructors,
    searchInstructorById,
    updateInstructorById,
    deleteInstructorById
}