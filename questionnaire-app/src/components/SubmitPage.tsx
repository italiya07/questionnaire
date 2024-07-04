import React from "react";
import { Button, Typography, Box } from "@mui/material";

interface SubmitPageProps {
  onBack: () => void;
  onSubmit: () => void;
}

const SubmitPage: React.FC<SubmitPageProps> = ({ onBack, onSubmit }) => {
  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Review your answers
      </Typography>
      <Typography variant="body1" paragraph>
        Please review your answers before submitting the questionnaire.
      </Typography>
      <Box
        sx={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}
      >
        <Button onClick={onBack} variant="outlined">
          Back
        </Button>
        <Button onClick={onSubmit} variant="contained" color="primary">
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default SubmitPage;
