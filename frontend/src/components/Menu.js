import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Container,
} from "@mui/material";
import LanguageContext from "../LanguageContext";

const notebookStyles = {
  paper: {
    borderLeft: "4px solid #d1d1d1",
    padding: "20px",
    marginBottom: "20px",
    position: "relative",
    backgroundColor: "#f5f3c4",
    overflow: "hidden",
    height: "auto",
  },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
    width: "100%",
  },
  verticalLine: {
    position: "absolute",
    left: "25%",
    top: "0",
    bottom: "0", // Stretches to the bottom of the parent container
    width: "0.05px", // Line width
    borderLeft: "2px solid rgba(0, 0, 0, 0.1)", // This will inherit the opacity from the parent
    backgroundColor: "#C46962",
    opacity: 0.7, // Set opacity to 80%
    height: "100vh",
  },
};

const Menu = () => {
  const { language, getProductName } = useContext(LanguageContext);
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
  }, [language]);

  if (!menu) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
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
        categorizedMenuItems[item.DayOfWeek][categoryName].push(
          menuItem.Product
        );
      } else {
        categorizedMenuItems[item.DayOfWeek][categoryName] = [menuItem.Product];
      }
    });
  });

  return (
    <Container>
      <Box sx={notebookStyles.container}>
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={notebookStyles.textLine}
        >
          {language.OurMenu}
        </Typography>
        {Object.keys(categorizedMenuItems).length ? (
          Object.keys(categorizedMenuItems).map((day, index) => (
            <Box sx={{ position: "relative" }}>
              <Paper key={index} elevation={3} sx={notebookStyles.paper}>
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={notebookStyles.textLine}
                >
                  {language[day] || day}
                </Typography>
                <List>
                  {Object.keys(categorizedMenuItems[day]).map(
                    (categoryName) => (
                      <Box key={categoryName} sx={{ marginBottom: 2 }}>
                        <Typography variant="h6" sx={notebookStyles.textLine}>
                          {language[categoryName] || categoryName}
                        </Typography>
                        {categorizedMenuItems[day][categoryName].map(
                          (item, idx) => (
                            <ListItem key={idx} sx={notebookStyles.listItem}>
                              <ListItemText
                                primary={getProductName(item.ProductID)}
                                secondary={item.Description}
                              />
                              <Box sx={notebookStyles.priceBox}>
                                <Typography variant="body1">
                                  {item.Price} Eur.
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {item.Calories} kcal
                                </Typography>
                              </Box>
                            </ListItem>
                          )
                        )}
                      </Box>
                    )
                  )}
                </List>
                <Box sx={notebookStyles.verticalLine} />
              </Paper>
            </Box>
          ))
        ) : (
          <Typography align="center">{language.NoMenuAvailable}</Typography>
        )}
      </Box>
    </Container>
  );
};

export default Menu;
