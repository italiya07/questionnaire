// src/App.tsx
import React, { useState, useEffect } from "react";
import "./App.css";
import { Question } from "./types";
import QuestionPage from "./components/QuestionPage";
import SubmitPage from "./components/SubmitPage";
import { Container, ThemeProvider, createTheme } from "@mui/material";
import { useMutation } from "@apollo/client";
import { SUBMIT_QUESTIONNAIRE } from "./constants";

const theme = createTheme();

const App: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [submitQuestionnaire] = useMutation(SUBMIT_QUESTIONNAIRE);

  useEffect(() => {
    fetch("/questions.json")
      .then((response) => response.json())
      .then((data) => setQuestions(data));
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleAnswer = (questionId: string, answer: any) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answer,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [questionId]: "",
    }));
  };

  const validateAnswer = (question: Question): boolean => {
    if (
      question.required &&
      (!answers[question.id] || answers[question.id].length === 0)
    ) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [question.id]: "This question is required",
      }));
      return false;
    }
    return true;
  };

  const handleNext = () => {
    const currentQuestion = questions[currentQuestionIndex];
    if (validateAnswer(currentQuestion)) {
      if (currentQuestionIndex < questions.length) {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitted(true);
    const isValid = questions.every(validateAnswer);
    if (isValid) {
      try {
        const formattedAnswers = Object.entries(answers).map(
          ([questionId, value]) => ({
            questionId,
            value: JSON.stringify(value),
          })
        );

        await submitQuestionnaire({
          variables: { response: { answers: formattedAnswers } },
        });

        setIsSubmitted(true);
      } catch (error) {
        console.error("Error submitting questionnaire:", error);
      }
    }
  };

  if (questions.length === 0) {
    return <div>Loading...</div>;
  }

  if (isSubmitted) {
    return <div>Thank you for submitting the questionnaire!</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <ThemeProvider theme={theme}>
      <Container>
        {currentQuestionIndex < questions.length ? (
          <QuestionPage
            question={currentQuestion}
            answer={answers[currentQuestion.id]}
            error={errors[currentQuestion.id]}
            onAnswer={handleAnswer}
            onNext={handleNext}
            onBack={handleBack}
            isFirst={currentQuestionIndex === 0}
            isLast={currentQuestionIndex === questions.length}
          />
        ) : (
          <SubmitPage onBack={handleBack} onSubmit={handleSubmit} />
        )}
      </Container>
    </ThemeProvider>
  );
};

export default App;
