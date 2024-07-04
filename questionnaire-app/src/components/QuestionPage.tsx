import React from "react";
import { Question } from "../types";
import {
  TextField,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Button,
  Typography,
  Box,
  FormControl,
  InputLabel,
  FormGroup,
  FormHelperText,
  Radio,
  RadioGroup,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";

interface QuestionPageProps {
  question: Question;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  answer: any;
  error: string | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onAnswer: (questionId: string, answer: any) => void;
  onNext: () => void;
  onBack: () => void;
  isFirst: boolean;
  isLast: boolean;
}

const QuestionPage: React.FC<QuestionPageProps> = ({
  question,
  answer,
  error,
  onAnswer,
  onNext,
  onBack,
  isFirst,
  isLast,
}) => {
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    onAnswer(question.id, event.target.value);
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    onAnswer(question.id, event.target.value);
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newAnswer = answer ? [...answer] : [];
    if (event.target.checked) {
      newAnswer.push(event.target.value);
    } else {
      const index = newAnswer.indexOf(event.target.value);
      if (index > -1) {
        newAnswer.splice(index, 1);
      }
    }
    onAnswer(question.id, newAnswer);
  };

  const renderInput = () => {
    switch (question.type) {
      case "text":
        return (
          <TextField
            fullWidth
            value={answer || ""}
            onChange={handleInputChange}
            required={question.required}
            error={!!error}
            helperText={error}
          />
        );
      case "longText":
        return (
          <TextField
            fullWidth
            multiline
            rows={4}
            value={answer || ""}
            onChange={handleInputChange}
            required={question.required}
            error={!!error}
            helperText={error}
          />
        );
      case "number":
        return (
          <TextField
            fullWidth
            type="number"
            value={answer || ""}
            onChange={handleInputChange}
            required={question.required}
            error={!!error}
            helperText={error}
            inputProps={{ "data-testid": "name-input" }}
          />
        );
      case "dropdown":
        return (
          <FormControl fullWidth error={!!error} required={question.required}>
            <InputLabel>{question.text}</InputLabel>
            <Select
              value={answer || ""}
              onChange={handleSelectChange}
              label={question.text}
            >
              {question.options?.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
            {error && <FormHelperText>{error}</FormHelperText>}
          </FormControl>
        );
      case "checkbox":
        return (
          <FormControl
            error={!!error}
            required={question.required}
            sx={{ width: "100%" }}
          >
            <FormGroup>
              {question.options?.map((option) => (
                <FormControlLabel
                  key={option}
                  control={
                    <Checkbox
                      checked={answer?.includes(option) || false}
                      onChange={handleCheckboxChange}
                      value={option}
                    />
                  }
                  label={option}
                />
              ))}
            </FormGroup>
            {error && <FormHelperText>{error}</FormHelperText>}
          </FormControl>
        );
      case "radio":
        return (
          <FormControl
            error={!!error}
            required={question.required}
            sx={{ width: "100%" }}
          >
            <RadioGroup value={answer || ""} onChange={handleInputChange}>
              {question.options?.map((option) => (
                <FormControlLabel
                  key={option}
                  value={option}
                  control={<Radio />}
                  label={option}
                />
              ))}
            </RadioGroup>
            {error && <FormHelperText>{error}</FormHelperText>}
          </FormControl>
        );
      default:
        return null;
    }
  };

  return (
    <Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
      >
        <Typography variant="h5" component="h2">
          {question.text}{" "}
          <span>({question.required ? "required" : "optional"})</span>
        </Typography>
      </Box>
      {renderInput()}
      <Box
        sx={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}
      >
        {!isFirst && (
          <Button size="large" onClick={onBack} variant="outlined">
            Back
          </Button>
        )}
        <Button
          size="large"
          onClick={onNext}
          variant="contained"
          sx={{ marginLeft: "auto" }}
        >
          {isLast ? "Submit" : "Next"}
        </Button>
      </Box>
    </Box>
  );
};

export default QuestionPage;
