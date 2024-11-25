module.exports = {
  async up(db, client) {
    // 1. Create 'user' collection
    await db.createCollection("user", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["username", "firstname", "lastname", "email", "password"],
          properties: {
            username: { bsonType: "string", uniqueItems: true },
            email: { bsonType: "string", uniqueItems: true, pattern: ".+@.+\\..+" },
            password: { bsonType: "string" },
            createdAt: { bsonType: "date" },
          },
        },
      },
    });

    console.log("Collection 'user' created with validation.");

    // 2. Create 'cv' collection
    await db.createCollection("cv", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["user", "title"],
          properties: {
            user: {
              bsonType: "objectId",
              description: "Reference to the 'User' collection and is required.",
            },
            title: {
              bsonType: "string",
              description: "The title of the CV and is required.",
            },
            summmary: {
              bsonType: "string",
              description: "Summary of the CV, optional.",
            },
            skills: {
              bsonType: "array",
              items: { bsonType: "string" },
              description: "List of skills.",
            },
            experiences: {
              bsonType: "array",
              items: {
                bsonType: "object",
                required: ["company", "position", "startDate"],
                properties: {
                  company: { bsonType: "string" },
                  position: { bsonType: "string" },
                  startDate: { bsonType: "date" },
                  endDate: { bsonType: "date" },
                  description: { bsonType: "string" },
                },
              },
              description: "List of work experiences.",
            },
            education: {
              bsonType: "array",
              items: {
                bsonType: "object",
                required: ["school", "degree", "startDate"],
                properties: {
                  school: { bsonType: "string" },
                  degree: { bsonType: "string" },
                  startDate: { bsonType: "date" },
                  endDate: { bsonType: "date" },
                },
              },
              description: "List of education history.",
            },
            visibility: {
              bsonType: "string",
              enum: ["public", "private"],
              default: "public",
              description: "Visibility of the CV.",
            },
            createdAt: {
              bsonType: "date",
              description: "Creation date, automatically generated.",
            },
            updatedAt: {
              bsonType: "date",
              description: "Update date, automatically generated.",
            },
          },
        },
      },
    });

    console.log("Collection 'cv' created with validation.");

    // 3. Create 'recommendation' collection (depends on 'user' and 'cv' collections)
    await db.createCollection("recommendation", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["cv", "user", "content"],
          properties: {
            cv: { bsonType: "objectId" },
            user: { bsonType: "objectId" },
            content: { bsonType: "string" },
            rating: { bsonType: "int", minimum: 1, maximum: 5 },
            createdAt: { bsonType: "date" },
          },
        },
      },
    });

    console.log("Collection 'recommendation' created with validation.");
  },

  async down(db, client) {
    // 1. Drop 'recommendation' collection first (since it depends on 'user' and 'cv')
    await db.collection("recommendation").drop();

    // 2. Drop 'cv' collection
    await db.collection("cv").drop();

    // 3. Drop 'user' collection last
    await db.collection("user").drop();

    console.log("Collections 'user', 'cv', and 'recommendation' dropped.");
  },
};
