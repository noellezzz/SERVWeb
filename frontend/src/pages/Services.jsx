import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Box,
} from "@mui/material";
import Question from "../components/Question.jsx"; // Import the reusable Question component

function Services() {
  const [answers, setAnswers] = useState({
    question1: "",
    question2: "",
    question3: "",
    question4: "",
    question5: "",
    question6: "",
    question7: "",
    question8: "",
    question9: "",
    question10: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAnswers({
      ...answers,
      [name]: value,
    });
  };

  const isFormComplete = Object.values(answers).every(
    (answer) => answer !== ""
  );

  return (
    <Box sx={{ maxWidth: 1200, margin: "auto", marginTop: 5 }}>
      <Card sx={{ minWidth: 275, boxShadow: 3 }}>
        <CardContent>
          <Typography
            variant="h3"
            component="div"
            sx={{
              marginTop: 2,
              marginBottom: 2,
              textAlign: "center",
              fontFamily: "'Poppins', sans-serif", // Apply Poppins font
            }}
          >
            Post-Service Feedback
          </Typography>

          <form>
            {/* General Questions */}
            <Question
              question="1. How would you describe your overall experience with our service today?"
              value={answers.question1}
              onChange={handleChange}
              name="question1"
              sx={{ textAlign: "center", fontFamily: "'Poppins', sans-serif" }}
            />
            <Question
              question="2. What did you think about the service staff's politeness and accommodation?"
              value={answers.question2}
              onChange={handleChange}
              name="question2"
              sx={{ textAlign: "center", fontFamily: "'Poppins', sans-serif" }}
            />
            <Question
              question="3. Were the instructions clear? If not, what part was unclear?"
              value={answers.question3}
              onChange={handleChange}
              name="question3"
              sx={{ textAlign: "center", fontFamily: "'Poppins', sans-serif" }}
            />
            <Question
              question="4. Did you encounter any difficulties? Please describe them."
              value={answers.question4}
              onChange={handleChange}
              name="question4"
              sx={{ textAlign: "center", fontFamily: "'Poppins', sans-serif" }}
            />
            <Question
              question="5. What aspects of the service process did you find most helpful?"
              value={answers.question5}
              onChange={handleChange}
              name="question5"
              sx={{ textAlign: "center", fontFamily: "'Poppins', sans-serif" }}
            />

            <Typography
              variant="h3"
              sx={{
                marginTop: 2,
                marginBottom: 2,
                textAlign: "center",
                fontFamily: "'Poppins', sans-serif", // Apply Poppins font
              }}
            >
              Specific to the Waiting Process
            </Typography>

            {/* Waiting Process Questions */}
            <Question
              question="6. What was your overall impression of the waiting area?"
              value={answers.question6}
              onChange={handleChange}
              name="question6"
              sx={{ textAlign: "center", fontFamily: "'Poppins', sans-serif" }}
            />
            <Question
              question="7. How would you describe your mood during the waiting process?"
              value={answers.question7}
              onChange={handleChange}
              name="question7"
              sx={{ textAlign: "center", fontFamily: "'Poppins', sans-serif" }}
            />
            <Question
              question="8. How did you feel about the time it took to resolve your issue?"
              value={answers.question8}
              onChange={handleChange}
              name="question8"
              sx={{ textAlign: "center", fontFamily: "'Poppins', sans-serif" }}
            />
            <Question
              question="9. How would you describe the cleanliness and maintenance of the waiting area?"
              value={answers.question9}
              onChange={handleChange}
              name="question9"
              sx={{ textAlign: "center", fontFamily: "'Poppins', sans-serif" }}
            />
            <Question
              question="10. Were there any distractions in the waiting area that affected your experience?"
              value={answers.question10}
              onChange={handleChange}
              name="question10"
              sx={{ textAlign: "center", fontFamily: "'Poppins', sans-serif" }}
            />

            <CardActions>
              <Button
                variant="contained"
                color="primary"
                size="large"
                disabled={!isFormComplete}
                sx={{
                  width: "100%",
                  fontFamily: "'Poppins', sans-serif", // Apply Poppins font
                }}
              >
                Submit Feedback
              </Button>
            </CardActions>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Services;
