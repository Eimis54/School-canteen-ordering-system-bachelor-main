import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import LanguageContext from "../LanguageContext";
import {
  Box,
  Typography,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Container,
} from "@mui/material";

const Menu = () => {
  const { language } = useContext(LanguageContext);
  const [menu, setMenu] = useState(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/menu/mainmenu");
        const data = await response.json();
        setMenu(data);
      } catch (error) {
        console.error(
          language.ErrorFetchingMenu,
          error.response ? error.response.data : error.message
        );
      }
    };

    fetchMenu();
  }, []);

  if (!menu) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ marginLeft: 2 }}>
          {language.Loading}
        </Typography>
      </Box>
    );
  }

  const categorizedMenuItems = {};

  menu.forEach((item) => {
    categorizedMenuItems[item.DayOfWeek] = {};
    item.MenuItems.forEach((menuItem) => {
      const categoryName = menuItem.Product?.ProductCategory?.CategoryName;

      if (categorizedMenuItems[item.DayOfWeek].hasOwnProperty(categoryName)) {
        categorizedMenuItems[item.DayOfWeek][categoryName].push(menuItem.Product);
      } else {
        categorizedMenuItems[item.DayOfWeek][categoryName] = [menuItem.Product];
      }
    });
  });

  return (
    <Container>
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" align="center" gutterBottom>
        {language.OurMenu}
      </Typography>
      {Object.keys(categorizedMenuItems).length ? (
        Object.keys(categorizedMenuItems).map((day, index) => (
          <Paper key={index} elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
            <Typography variant="h5" gutterBottom>
              {language[day]} {/* Use translation for the day */}
            </Typography>
            {Object.keys(categorizedMenuItems[day]).map((categoryName) => (
              <Box key={categoryName} sx={{ marginBottom: 2 }}>
                <Typography variant="h6">{categoryName}</Typography>
                <List>
                  {categorizedMenuItems[day][categoryName].map((item, idx) => (
                    <ListItem key={idx} sx={{ display: "flex", justifyContent: "space-between" }}>
                      <ListItemText
                        primary={item.ProductName}
                        secondary={item.Description}
                      />
                      <Typography variant="body1">{item.Price} Eur.</Typography>
                    </ListItem>
                  ))}
                </List>
              </Box>
            ))}
          </Paper>
        ))
      ) : (
        <Typography align="center">{language.NoMenuAvailable}</Typography>
      )}
    </Box>
    </Container>
  );
};

export default Menu;
