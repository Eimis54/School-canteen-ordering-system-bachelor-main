import React, { useContext } from "react";
import LanguageContext from "../LanguageContext";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Container,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const FAQ = () => {
  const { language } = useContext(LanguageContext);

  const faqData = [
    {
      question: language.FAQPlaceOrder || "How do I place an order for my child?",
      answer:
        language.FAQPlaceOrderDesc ||
        "Select your child's name, choose their desired meals, and add them to the cart. Once done, proceed to checkout and confirm the order.",
    },
    {
      question: language.FAQCancelModifyOrder || "Can I cancel or modify an order after it's placed?",
      answer:
        language.FAQCancelModifyOrderDesc ||
        "Orders can be canceled within a certain time period. Please check the 'Order History' section for options to cancel.",
    },
    {
      question: language.FAQPaymentMethods || "What payment methods are accepted?",
      answer:
        language.FAQPaymentMethodsDesc ||
        "We accept online payment options like Stripe. Payments are securely processed through our payment system.",
    },
    {
      question: language.FAQOrderHistory || "How do I check my child’s order history?",
      answer:
        language.FAQOrderHistoryDesc ||
        "To view past orders, go to the 'Order History' section on your account dashboard. Here, you’ll find details about all past and current orders.",
    },
    {
      question: language.FAQChildAbsent || "What happens if my child is absent on the day of the order?",
      answer:
        language.FAQChildAbsentDesc ||
        "If your child is absent, please cancel the order as early as possible.",
    },
    {
      question: language.FAQContactSupport || "How do I contact support if I have issues with the system?",
      answer:
        language.FAQContactSupportDesc ||
        "For any assistance, please contact support at support@evalgykla.com or call us at the provided contact number on the support page.",
    },
  ];

  return (
    <Container sx={{ paddingTop: 4, paddingBottom: 4 }}>
      <Typography variant="h4" gutterBottom>
        {language.FrequentlyAskedQuestions || "Frequently Asked Questions"}
      </Typography>
      <Typography variant="subtitle1" paragraph>
        {language.WelcomeToFAQ || "Find answers to common questions below."}
      </Typography>
      {faqData.map((faq, index) => (
        <Accordion key={index}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">{faq.question}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1">{faq.answer}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Container>
  );
};

export default FAQ;
