const test = require("ava");
const { knex } = require("../../database");
const topicModel = require(".");
const weekModel = require("../week");
const instructorModel = require("../instructor")

test.beforeEach(async () => {
  // Clear the weeks and topics tables before each test so we don't have to worry about reinserting the same id
  // We have to clear the week table because topic depends on week
  await knex(topicModel.TOPIC_TABLE_NAME).del();
  await knex(weekModel.WEEK_TABLE_NAME).del();
  await knex(instructorModel.INSTRUCTOR_TABLE_NAME).del();
  await knex(instructorModel.INSTRUCTOR_TABLE_NAME).insert({ id: 1, name: "Bikash" })
  await knex(weekModel.WEEK_TABLE_NAME).insert({ number: 5, name: "Week #7", instructor_id: 1 });
});

test.serial("insertForTopic > Returns the inserted topic", async (t) => {
  t.plan(4);
  // We setup the test by inserting a topic to the database
  const result = await topicModel.insertForTopic(5, "HTML & CSS");
  t.is(result.length, 1, "Must return one item");

  const insertedItem = result[0];
  t.true(
    insertedItem.id && insertedItem.id.length === 36,
    "Must generate an id of 36 characters in length (which is the standard for UUID used by Postgres)"
  );
  const expectedResult = { week_number: 5, name: "HTML & CSS" };
  t.is(
    insertedItem.week_number,
    expectedResult.week_number,
    "Must have correct week number"
  );
  t.is(insertedItem.name, expectedResult.name, "Must have correct name");
});

test.serial("insertForTopic > Returns the inserted Topics", async (t) => {
  const result = await topicModel.insertForTopic(5, "Knexfile");
  const expectedResult = [{ id: result[0].id, name: "Knexfile", week_number: 5 }];
  t.deepEqual(
    result,
    expectedResult,
    "Must return inserted object in an array")
});

test.serial("insertForTopic > Topics are actually inserted in the database", async (t) => {
  const result = await topicModel.insertForTopic(5, "Backend");
  const dbQueryResult = await knex(topicModel.TOPIC_TABLE_NAME).where(
    "week_number",
    5
  )
  t.deepEqual(
    result,
    dbQueryResult,
    "Must return the result of topic inserted from database ")
});

test.serial(
  "insertForTopics > Throws when trying to insert a topic for a non existent week",
  async (t) => {
    await t.throwsAsync(
      () => topicModel.insertForTopic(9, "Backend"),
      undefined,
      "Must throw  when trying to insert a topic for a non existent week"
    );
  }
);

test.serial("updateTopicById > Returns the updated topic",
  async (t) => {
    await knex(topicModel.TOPIC_TABLE_NAME).insert({ week_number: 5, name: "express" })
    const dbQueryId = await knex(topicModel.TOPIC_TABLE_NAME).where(
      "week_number",
      5
    )
    const result = await topicModel.updateTopicById(dbQueryId[0].id, { name: "MongoDB" })
    const expectedResult = [{ id: dbQueryId[0].id, week_number: 5, name: "MongoDB" }]
    t.deepEqual(result,
      expectedResult,
      "Must return updated values by id")
  });

test.serial("updateTopicById > Updates a topic",
  async (t) => {
    await knex(topicModel.TOPIC_TABLE_NAME).insert({ week_number: 5, name: "express" })
    const dbQueryId = await knex(topicModel.TOPIC_TABLE_NAME).where(
      "week_number",
      5
    )
    const result = await topicModel.updateTopicById(dbQueryId[0].id, { name: "MongoDB" })
    const expectedResult = await knex(topicModel.TOPIC_TABLE_NAME).where(
      "week_number",
      5
    )
    t.deepEqual(result,
      expectedResult,
      "Must return updated values by id")
  });

test.serial(
  "searchTopicWithWeekData > Returns topics matching the passed string", async (t) => {
    await knex(topicModel.TOPIC_TABLE_NAME).insert({ week_number: 5, name: "Knexfile" });
    const dbQueryId = await knex(topicModel.TOPIC_TABLE_NAME).where(
      "week_number",
      5
    )
    const result = await topicModel.searchTopicWithWeekData("Knexfile")
    const expectedResult = [
      {
        id: dbQueryId[0].id,
        name: 'Knexfile',
        week_number: 5,
        week_name: 'Week #7'
      }
    ]
    // console.log(result)
    // console.log(dbQueryId)
    // console.log(expectedResult)
    t.deepEqual(
      result,
      expectedResult,
      "Must return topics matching the passed")
  }
);

test.serial(
  "searchTopicWithWeekData > Returns empty array if no topics match the query",
  async (t) => {
    await knex(topicModel.TOPIC_TABLE_NAME).insert({ week_number: 5, name: "Knexfile" });
    const dbQueryId = await knex(topicModel.TOPIC_TABLE_NAME).where(
      "week_number",
      5
    )
    const result = await topicModel.searchTopicWithWeekData("aa")
    const expectedResult = []
    t.deepEqual(
      result,
      expectedResult,
      "Must return empty not matching topics of the passed argument")
  }
);

test.serial("deleteTopicById > Deletes the topic whose id is passed as an argument",
  async (t) => {
    await knex(topicModel.TOPIC_TABLE_NAME).insert({ week_number: 5, name: "Knexfile" });
    const dbQueryId = await knex(topicModel.TOPIC_TABLE_NAME).where(
      "week_number",
      5
    )
    // console.log("ID", dbQueryId)
    const result = await topicModel.deleteTopicById(dbQueryId[0].id)
    const expectedResult = 1;
    // console.log( result)
    // console.log( dbQueryId)
    // console.log( expectedResult)
    t.deepEqual(
      result,
      expectedResult,
      "Must return inserted object in an array")
  });

// test.todo("deleteTopicById > Does not throw when deleting non-existent topic");