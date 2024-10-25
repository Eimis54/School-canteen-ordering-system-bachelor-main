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
  backdropClasses,
} from "@mui/material";
import LanguageContext from "../LanguageContext";

// Custom styles
const notebookStyles = {
  paper: {
    borderLeft: "4px solid #d1d1d1", // Vertical line on the left (like notebook margin)
    padding: "20px",
    marginBottom: "20px",
    position: "relative", // Make it relative for absolute positioning of the vertical line
    backgroundColor: "#EAEBE5",
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
    left: "18%", // Position the vertical line at the end of the price box
    top: "0", // Align it to the top of the parent box
    height: "126%", // Make it extend the full height of the list items
    borderLeft: "2px solid rgba(0, 0, 0, 0.1)", // Vertical line
    marginLeft: "10px", // Space between the product and the vertical line
    backgroundColor:"#C46962"
  },
};

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
  }, [language]);

  if (!menu) {
    return (
      <Box
        sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}
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
        categorizedMenuItems[item.DayOfWeek][categoryName].push(menuItem.Product);
      } else {
        categorizedMenuItems[item.DayOfWeek][categoryName] = [menuItem.Product];
      }
    });
  });

  return (
    <Container>
      <Box sx={notebookStyles.container}>
        <Typography variant="h4" align="center" gutterBottom sx={notebookStyles.textLine}>
          {language.OurMenu}
        </Typography>
        {Object.keys(categorizedMenuItems).length ? (
          Object.keys(categorizedMenuItems).map((day, index) => (
            <Paper key={index} elevation={3} sx={notebookStyles.paper}>
              <Typography variant="h5" gutterBottom sx={notebookStyles.textLine}>             
                {language[day]}                 
              </Typography>
              {Object.keys(categorizedMenuItems[day]).map((categoryName) => (
                <Box key={categoryName} sx={{ marginBottom: 2 }}>
                  <Typography variant="h6" sx={notebookStyles.textLine}>
                    {categoryName}
                  </Typography>
                  <List sx={{ position: "relative" }}>
                    
                    {categorizedMenuItems[day][categoryName].map((item, idx) => (
                      <ListItem key={idx} sx={notebookStyles.listItem}>
                        <ListItemText
                          primary={item.ProductName}
                          secondary={item.Description}
                        />
                        <Box sx={notebookStyles.priceBox}>
                          <Typography variant="body1">{item.Price} Eur.</Typography>
                        </Box>
                      </ListItem>
                    ))}
                    <Box sx={notebookStyles.verticalLine} />
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
