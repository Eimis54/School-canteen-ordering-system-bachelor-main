import React, { useContext } from "react";
import LanguageContext from "../LanguageContext";
import { Box, Container } from "@mui/material";
import backgroundImg from "../assets/backgroundImg.png";

const FAQ = () => {
  const { language } = useContext(LanguageContext);
  return (
    <Box
      sx={{
        backgroundImage: `url('${backgroundImg}')`,
        backgroundSize: "contain",
        height: "100%",
      }}
    >
      <Container sx={{ pt: 4 }}>
        <div>
          <h1>this is FAQ page</h1>
          <p>Welcome</p>
        </div>
      </Container>
    </Box>
  );
};

export default FAQ;
