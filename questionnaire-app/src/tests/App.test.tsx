import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import App from "../App";
import { SUBMIT_QUESTIONNAIRE } from "../constants";

global.fetch = vi.fn();

const mockQuestions = [
  {
    id: "1",
    type: "text",
    text: "What is your name?",
    required: true,
  },
  {
    id: "2",
    type: "number",
    text: "How old are you?",
    required: false,
  },
];

const mocks = [
  {
    request: {
      query: SUBMIT_QUESTIONNAIRE,
      variables: {
        response: {
          answers: [
            { questionId: "1", value: '"John"' },
            { questionId: "2", value: '"25"' },
          ],
        },
      },
    },
    result: { data: { submitQuestionnaire: true } },
  },
];

describe("App", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    (global.fetch as jest.Mock).mockResolvedValue({
      json: () => Promise.resolve(mockQuestions),
    });
  });

  it("renders loading state initially", () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <App />
      </MockedProvider>
    );
    expect(screen.getByText("Loading...")).toBeTruthy();
  });

  it("renders the first question after loading", async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <App />
      </MockedProvider>
    );
    await waitFor(() => {
      expect(screen.getByText("What is your name?")).toBeTruthy();
    });
  });

  it("shows error when required question is not answered", async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <App />
      </MockedProvider>
    );
    await waitFor(() => {
      expect(screen.getByText("What is your name?")).toBeTruthy();
    });
    fireEvent.click(screen.getByText("Next"));
    await waitFor(() => {
      expect(screen.getByText("This question is required")).toBeTruthy();
    });
  });

  it("submits the questionnaire when all questions are answered", async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <App />
      </MockedProvider>
    );
    await waitFor(() => {
      expect(screen.getByText("What is your name?")).toBeTruthy();
    });

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "John" },
    });

    fireEvent.click(screen.getByText("Next"));
    await waitFor(() => {
      expect(screen.getByText("How old are you?")).toBeTruthy();
    });
    fireEvent.change(screen.getByRole("spinbutton"), {
      target: { value: 25 },
    });
    fireEvent.click(screen.getByText("Next"));
    await waitFor(() => {
      expect(
        screen.getByText(
          "Please review your answers before submitting the questionnaire."
        )
      ).toBeTruthy();
    });
    fireEvent.click(screen.getByText("Submit"));
    await waitFor(() => {
      expect(
        screen.getByText("Thank you for submitting the questionnaire!")
      ).toBeTruthy();
    });
  });
});
