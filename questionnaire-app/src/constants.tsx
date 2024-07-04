import { gql } from "@apollo/client";

export const SUBMIT_QUESTIONNAIRE = gql`
  mutation SubmitQuestionnaire($response: QuestionnaireResponseInput!) {
    submitQuestionnaire(response: $response)
  }
`;
