import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import LanguageContext from "../LanguageContext";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Container,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

const API_BASE_URL = 'http://localhost:3001';

const OrderSection = () => {
  const { language } = useContext(LanguageContext);
  const [menu, setMenu] = useState(null);
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState("");
  const [groupedProducts, setGroupedProducts] = useState({});
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchProductCategories = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/productcategories`);
        setCategories(response.data);
      } catch (error) {
        console.error(language.ErrorFetchingCategories, error);
      }
    };

    const fetchPublicMenu = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/menu/publicmenu`);
        setMenu(response.data);
      } catch (error) {
        setError(language.FailedToFetchMenu);
        console.error(error);
      }
    };

    fetchProductCategories();
    fetchPublicMenu();
  }, [language]);

  useEffect(() => {
    if (menu && categories.length > 0) {
      groupProductsByCategory(menu.MenuItems);
    }
  }, [menu, categories]);

  const groupProductsByCategory = (menuItems) => {
    const grouped = menuItems.reduce((acc, item) => {
      const category = categories.find(
        (cat) => cat.CategoryID === item.Product.CategoryID
      );

      const categoryName = category ? category.CategoryName : "Other";
      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }
      acc[categoryName].push(item);
      return acc;
    }, {});

    setGroupedProducts(grouped);
  };

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_BASE_URL}/api/children`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setChildren(response.data);
      } catch (error) {
        setError(language.FailedToFetchChildren);
        console.error(error);
      }
    };
    fetchChildren();
  }, [language]);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/photo`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setPhotos(response.data);
      } catch (error) {
        console.error(language.ErrorFetchingPhotos, error);
      }
    };
    fetchPhotos();
  }, [language]);

  const handleItemSelection = (product, quantity) => {
    setSelectedItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.ProductID === product.ProductID
      );
      if (existingItemIndex >= 0) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = { ...product, Quantity: quantity };
        return updatedItems;
      } else {
        return [...prevItems, { ...product, Quantity: quantity }];
      }
    });
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();

    if (!selectedChild) {
      return alert(language.PleaseSelectAChild);
    }

    if (selectedItems.length === 0) {
      return alert(language.NoItemsSelectedForCart);
    }

    try {
      const token = localStorage.getItem("token");

      let CartID = localStorage.getItem("cartID");
      if (!CartID) {
        const cartResponse = await axios.post(
          `${API_BASE_URL}/api/cart/create`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        CartID = cartResponse.data.CartID;
        localStorage.setItem("cartID", CartID);
      }

      const cartItems = selectedItems.map((item) => ({
        ProductID: item.ProductID,
        Quantity: item.Quantity,
        Price: item.Price,
        Calories: item.Calories,
      }));

      await axios.post(
        `${API_BASE_URL}/api/cart/add`,
        {
          ChildID: selectedChild,
          Items: cartItems,
          CartID,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(language.ItemsAddedToCartSuccess);
      setSelectedChild("");
      setSelectedItems([]);
    } catch (error) {
      setError(language.FailedToAddToCart);
      console.error(error);
    }
  };

  return (
    <Container>
    <Box sx={{ padding: "20px", paddingBottom: "40px", px:"20px" }}>
      <h2>{language.AddToCart}</h2>
      {error && <div style={{ color: "red" }}>{error}</div>}

      <FormControl fullWidth margin="normal">
        <InputLabel sx={{color: "black"}}>{language.SelectChild}</InputLabel>
        <Select
          value={selectedChild}
          onChange={(e) => setSelectedChild(e.target.value)}
          sx={{backgroundColor: "white"}}
        >
          <MenuItem value="">{language.Select}</MenuItem>
          {children.length > 0 ? (
            children.map((child) => (
              <MenuItem key={child.id} value={child.id}>
                {child.Name}
              </MenuItem>
            ))
          ) : (
            <MenuItem value="">{language.NoChildrenAvailable}</MenuItem>
          )}
        </Select>
      </FormControl>

      {menu ? (
        <div>
          <h3>
            {language.MenuFor} {language[menu.DayOfWeek]}
          </h3>
          {Object.keys(groupedProducts).map((category) => (
            <div key={category}>
              <h4>{category}</h4>
              <Grid container spacing={2}>
                {groupedProducts[category].map((item) => {
                  const photo = photos.find(
                    (photo) => photo.ProductID === item.Product.ProductID
                  );
                  const existingItem = selectedItems.find(
                    (selected) => selected.ProductID === item.Product.ProductID
                  );
                  const quantity = existingItem ? existingItem.Quantity : 0;

                  return (
                    <Grid item xs={12} sm={6} md={3} key={item.Product.ProductID}>
                      <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                        <Box sx={{ flexGrow: 1 }}>
                          <CardMedia
                            component="img"
                            sx={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                            image={photo ? `${API_BASE_URL}/${photo.PhotoURL}` : null}
                            alt={photo ? photo.AltText : language.Photo}
                          />
                        </Box>
                        <CardContent>
                          <Typography variant="h6">
                            {item.Product.ProductName}
                          </Typography>
                          <Typography variant="body2">
                            {item.Product.Price} Eur.
                          </Typography>
                          <Box display="flex" alignItems="center">
                            <IconButton
                              onClick={() => handleItemSelection(item.Product, Math.max(0, quantity - 1))}
                            >
                              <RemoveIcon />
                            </IconButton>
                            <Typography variant="body1" sx={{ mx: 2 }}>
                              {quantity}
                            </Typography>
                            <IconButton
                              onClick={() => handleItemSelection(item.Product, quantity + 1)}
                            >
                              <AddIcon />
                            </IconButton>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            </div>
          ))}
        </div>
      ) : (
        <p>{language.LoadingMenu}</p>
      )}

      <Button variant="contained" color="primary" onClick={handleAddToCart}>
        {language.AddToCart}
      </Button>
    </Box>
    </Container>
  );
};

export default OrderSection;
