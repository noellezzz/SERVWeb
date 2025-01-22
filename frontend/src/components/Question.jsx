import React from "react";
import { Typography, TextField } from "@mui/material";

function Question({ question, value, onChange, name }) {
  return (
    <div>
      <Typography variant="h6" sx={{ marginBottom: 1, paddingRight: 10, paddingLeft: 10 }}>
        {question}
      </Typography>
      <TextField
        fullWidth
        variant="outlined"
        name={name}
        value={value}
        onChange={onChange}
        sx={{ marginBottom: 2, paddingRight: 10, paddingLeft: 10 }}
        multiline
        rows={2}
      />
    </div>
  );
}

export default Question;
