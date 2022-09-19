const test = require("ava");
const { knex } = require("../../database");
const weekModel = require("./index");
const topicModel = require('../topic/index')
const instructorModel = require('../instructor/index')

test.beforeEach(async () => {
  // Clear the weeks table before each test so we don't have to worry about reinserting the same id
  await knex(weekModel.WEEK_TABLE_NAME).del();
  await knex(topicModel.TOPIC_TABLE_NAME).del();
  await knex(instructorModel.INSTRUCTOR_TABLE_NAME).del();
  await knex(instructorModel.INSTRUCTOR_TABLE_NAME).insert({ id: 1, name: 'Bikash' })

});

// We use test.serial so that tests are run one after another and we dont run into problems with duplicate primary key insertion
// The default behavior of ava is to run tests parallelly.
test.serial("insertWeek > Returns the inserted week", async (t) => {
  t.plan(1);
  // Try to insert a week in the database
  const result = await weekModel.insertWeek(1, "Week #1", 1);
  const expectedResult = [{ number: 1, name: "Week #1", instructor_id: 1 }];
  t.deepEqual(
    result,
    expectedResult,
    "Must return the inserted object in an array"
  );
});

test.serial(
  "insertWeek > Week is actually inserted in the database",
  async (t) => {
    t.plan(1);
    await weekModel.insertWeek(1, "Week #1", 1);
    // We write a query here instead of using a method inside weekModel
    // because using something inside weekModel would defeat the purpose of testing weekModel
    const dbQueryResult = await knex(weekModel.WEEK_TABLE_NAME).where(
      "number",
      1
    );
    t.deepEqual(
      dbQueryResult,
      [{ number: 1, name: "Week #1", instructor_id: 1 }],
      "Must return the inserted object from database"
    );
  }
);

test.serial(
  "insertWeek > Throws when an existing week number is inserted again",
  async (t) => {
    t.plan(1);
    // We setup the test by inserting a week to the database
    await weekModel.insertWeek(2, "Week #2", 1);
    // We try to insert the week again
    await t.throwsAsync(
      () => weekModel.insertWeek(2, "Week #2", 1),
      { instanceOf: Error },
      "Must throw if the same week is inserted more than once"
    );
  }
);

// test.todo("insertWeeks > Returns the inserted weeks");
test.serial("insertWeeks > Returns the inserted weeks",
  async (t) => {
    const result = await weekModel.insertWeeks([
      { number: 1, name: 'Week#1', instructor_id: 1 },
      { number: 2, name: 'Week#2', instructor_id: 1 }
    ])
    // console.log(result)
    const expectedResult = [
      { number: 1, name: 'Week#1', instructor_id: 1 },
      { number: 2, name: 'Week#2', instructor_id: 1 }
    ]
    t.deepEqual(
      result,
      expectedResult,
      "Must return the array of objects entered"
    )
  }
)

// test.todo("insertWeeks > Weeks are actually inserted in the database");
test.serial("insertWeeks > Weeks are actually inserted in the database",
  async (t) => {
    const result = await weekModel.insertWeeks([
      { number: 1, name: "Week2", instructor_id: 1 },
      { number: 2, name: "Week3", instructor_id: 1 }
    ])
    const dbQueryResult = await knex(weekModel.WEEK_TABLE_NAME);
    t.deepEqual(
      result,
      dbQueryResult,
      "must return the inserted array of objects form database"
    )
  }
)

// test.todo("insertWeeks > Throws when an existing week number is inserted again");
test.serial("insertWeeks > Throws when an existing week number is inserted again",
  async (t) => {
    t.plan(1);
    await weekModel.insertWeeks([
      { number: 1, name: "Week3", instructor_id: 1 },
      { number: 2, name: "Week4", instructor_id: 1 }
    ]);
    await t.throwsAsync(
      () => weekModel.insertWeeks([{ number: 1, name: "Week2", instructor_id: 1 }, { number: 2, name: "Week3", instructor_id: 1 }]),
      { instanceOf: Error },
      "Must throw if the same week is inserted more than once"
    )
  }
)

// test.todo("findAllWeeks > Returns all weeks in the database");
test.serial("findAllWeeks > Returns all weeks in the database",
  async (t) => {
    const result = await weekModel.findAllWeeks();
    // console.log(result)
    const dbQueryResult = await knex(weekModel.WEEK_TABLE_NAME);
    // console.log(dbQueryResult)
    t.deepEqual(
      result,
      dbQueryResult,
      "Must return all the database results of weeks")
  }
)
