import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import QuestionPage from "../components/QuestionPage";
import { Question } from "../types";

describe("QuestionPage", () => {
  const mockOnAnswer = vi.fn();
  const mockOnNext = vi.fn();
  const mockOnBack = vi.fn();

  const baseProps = {
    onAnswer: mockOnAnswer,
    onNext: mockOnNext,
    onBack: mockOnBack,
    isFirst: false,
    isLast: false,
    error: undefined,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders text question correctly", () => {
    const question: Question = {
      id: "1",
      text: "What is your name?",
      type: "text",
      required: true,
    };

    render(<QuestionPage {...baseProps} question={question} answer="" />);

    expect(screen.getByText("What is your name?")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("renders number question correctly", () => {
    const question: Question = {
      id: "2",
      text: "How old are you?",
      type: "number",
      required: false,
    };

    render(<QuestionPage {...baseProps} question={question} answer="" />);

    expect(screen.getByText("How old are you?")).toBeInTheDocument();
    expect(screen.getByRole("spinbutton")).toBeInTheDocument();
  });

  it("renders dropdown question correctly", () => {
    const question: Question = {
      id: "3",
      text: "Select your favorite color",
      type: "dropdown",
      options: ["Red", "Blue", "Green"],
      required: true,
    };

    render(<QuestionPage {...baseProps} question={question} answer="" />);

    expect(screen.getAllByText("Select your favorite color")).toHaveLength(2);
  });

  it("renders checkbox question correctly", () => {
    const question: Question = {
      id: "4",
      text: "Select your hobbies",
      type: "checkbox",
      options: ["Reading", "Sports", "Music"],
      required: false,
    };

    render(<QuestionPage {...baseProps} question={question} answer={[]} />);

    expect(screen.getByText("Select your hobbies")).toBeInTheDocument();
    expect(screen.getAllByRole("checkbox")).toHaveLength(3);
  });

  it("calls onAnswer when input changes", () => {
    const question: Question = {
      id: "1",
      text: "What is your name?",
      type: "text",
      required: true,
    };

    render(<QuestionPage {...baseProps} question={question} answer="" />);

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "John Doe" } });

    expect(mockOnAnswer).toHaveBeenCalledWith("1", "John Doe");
  });

  it("calls onNext when Next button is clicked", () => {
    const question: Question = {
      id: "1",
      text: "What is your name?",
      type: "text",
      required: true,
    };

    render(<QuestionPage {...baseProps} question={question} answer="" />);

    const nextButton = screen.getByText("Next");
    fireEvent.click(nextButton);

    expect(mockOnNext).toHaveBeenCalled();
  });

  it("calls onBack when Back button is clicked", () => {
    const question: Question = {
      id: "1",
      text: "What is your name?",
      type: "text",
      required: true,
    };

    render(<QuestionPage {...baseProps} question={question} answer="" />);

    const backButton = screen.getByText("Back");
    fireEvent.click(backButton);

    expect(mockOnBack).toHaveBeenCalled();
  });

  it("displays error message when provided", () => {
    const question: Question = {
      id: "1",
      text: "What is your name?",
      type: "text",
      required: true,
    };

    render(
      <QuestionPage
        {...baseProps}
        question={question}
        answer=""
        error="This field is required"
      />
    );

    expect(screen.getByText("This field is required")).toBeInTheDocument();
  });
});
