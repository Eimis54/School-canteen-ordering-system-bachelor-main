import React, { useContext } from "react";
import LanguageContext from "../LanguageContext";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Container,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const Help = () => {
  const { language } = useContext(LanguageContext);

  const helpTopics = [
    {
      title: language.HelpCreateAccount || "How to Create an Account",
      description:
        language.HelpCreateAccountDesc ||
        "To create an account, click on the 'Sign Up' button on the homepage. Fill in the required fields, including your name, email, and password. Once completed, check your email for a verification link.",
    },
    {
      title: language.HelpResetPassword || "How to Reset Your Password",
      description:
        language.HelpResetPasswordDesc ||
        "If you've forgotten your password, click on the 'Forgot Password?' link on the login page. Enter your email address, and you'll receive a password reset link.",
    },
    {
      title: language.HelpUpdateProfile || "How to Update Your Profile Information",
      description:
        language.HelpUpdateProfileDesc ||
        "To update your profile, log into your account and navigate to the 'Profile' section. Here, you can change your name, email, phone number, and dietary preferences.",
    },
    {
      title: language.HelpPlaceOrder || "How to Place an Order",
      description:
        language.HelpPlaceOrderDesc ||
        "After logging in, select your child's name, choose the desired meals, and add them to your cart. Proceed to checkout to confirm your order.",
    },
    {
      title: language.HelpContactSupport || "How to Contact Support",
      description:
        language.HelpContactSupportDesc ||
        "For any questions or issues, you can contact support through the 'Contact Us' page. You can also reach us at support@schoolcanteen.com.",
    },
  ];

  return (
    <Container sx={{ paddingTop: 4, paddingBottom: 4 }}>
      <Typography variant="h4" gutterBottom>
        {language.Help || "Help"}
      </Typography>
      <Typography variant="subtitle1" paragraph>
        {language.WelcomeToHelpPage || "Find assistance on various topics below."}
      </Typography>
      {helpTopics.map((topic, index) => (
        <Accordion key={index}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">{topic.title}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1">{topic.description}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
      <Box sx={{ marginTop: 3 }}>
        <Typography variant="body2">
          {language.ContactSupport || "For further assistance, please contact our support team."}
        </Typography>
      </Box>
    </Container>
  );
};

export default Help;
