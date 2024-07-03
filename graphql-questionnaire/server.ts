import { ApolloServer, gql } from "apollo-server-express";
import express from "express";
import fs from "fs";

const DATA_FILE = "questionnaire-data.json";

const readData = (): any => {
  try {
    const data = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return {};
  }
};

const writeData = (data: any) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

let questionnaireData = readData();

const typeDefs = gql`
  input AnswerInput {
    questionId: ID!
    value: String
  }

  input QuestionnaireResponseInput {
    answers: [AnswerInput!]!
  }

  type Question {
    id: ID!
    text: String!
    type: String!
    required: Boolean!
    options: [String]
  }

  type Answer {
    questionId: ID!
    value: String
  }

  type Submission {
    id: ID!
    createdAt: String!
    answers: [Answer!]!
  }

  type Query {
    submissions: [Submission!]!
  }

  type Mutation {
    submitQuestionnaire(response: QuestionnaireResponseInput!): Boolean
  }
`;

const resolvers = {
  Query: {
    submissions: () => Object.values(questionnaireData),
  },
  Mutation: {
    submitQuestionnaire: async (
      _: any,
      args: { response: { answers: { questionId: string; value: string }[] } }
    ) => {
      const { response } = args;

      try {
        const newSubmissionId = Date.now().toString();
        const newSubmission = {
          id: newSubmissionId,
          createdAt: new Date().toISOString(),
          answers: response.answers,
        };

        questionnaireData[newSubmissionId] = newSubmission;
        writeData(questionnaireData);

        console.log(
          `Questionnaire submitted successfully with ID: ${newSubmissionId}`
        );
        return true;
      } catch (error) {
        console.error("Error submitting questionnaire:", error);
        return false;
      }
    },
  },
};

async function startServer() {
  const server = new ApolloServer({ typeDefs, resolvers });
  const app: express.Application = express();

  await server.start();
  server.applyMiddleware({ app } as any);

  const port = 4000;
  app.listen({ port }, () => {
    console.log(
      `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`
    );
  });
}

startServer();
