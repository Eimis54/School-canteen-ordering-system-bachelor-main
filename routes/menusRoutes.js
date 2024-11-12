const express = require("express");
const router = express.Router();
const { Menu, MenuItem, Product } = require("../models");
const { authenticateToken, isAdmin } = require("../middleware/auth.js");
const { ProductCategory } = require("../db.js");

router.post("/", authenticateToken, isAdmin, async (req, res) => {
  const { DayOfWeek, IsPublic, MenuItems } = req.body;

  try {
    let menu = await Menu.findOne({ where: { DayOfWeek } });

    if (menu) {
  
      await menu.update({ IsPublic });
    } else {
   
      menu = await Menu.create({ DayOfWeek, IsPublic });
    }

    await MenuItem.destroy({ where: { MenuID: menu.MenuID } });
    if (MenuItems && MenuItems.length > 0) {
      const items = MenuItems.map((item) => ({
        MenuID: menu.MenuID,
        ProductID: item.ProductID,
      }));
      await MenuItem.bulkCreate(items);
    }

    res.json(menu);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

router.get("/", async (req, res) => {
  try {
    const menus = await Menu.findAll({
      include: {
        model: MenuItem,
        as: "MenuItems",
        include: {
          model: Product,
          as: "Product",
        },
      },
    });
    res.json(menus);
  } catch (error) {
    console.error("Error fetching menus:", error);
    res.status(500).json({ error: "Failed to fetch menus" });
  }
});
router.get("/mainmenu", async (req, res) => {
  try {
    const publicMenu = await Menu.findAll({
      where: { IsPublic: true },
      include: {
        model: MenuItem,
        as: "MenuItems",
        include: {
          model: Product,
          as: "Product",
          include: {
            model: ProductCategory,
            attributes: ["CategoryName"],  
          },
        },
      },
    });

    if (!publicMenu) {
      return res.status(404).json({ error: "No public menu available" });
    }

    res.status(200).json(publicMenu);
  } catch (error) {
    console.error("Error fetching public menu:", error);
    res.status(500).json({ error: "Failed to fetch public menu" });
  }
});
router.get("/publicmenu", async (req, res) => {
  try {
    const publicMenu = await Menu.findOne({
      where: { IsPublic: true },
      include: {
        model: MenuItem,
        as: "MenuItems",
        include: {
          model: Product,
          as: "Product",
        },
      },
    });
    res.json(publicMenu);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch public menu" });
  }
});
router.get("/publicmenu/:dayOfWeek", async (req, res) => {
  const { dayOfWeek } = req.params;
  try {
    const menu = await Menu.findOne({
      where: { DayOfWeek: dayOfWeek },
      include: {
        model: MenuItem,
        as: "MenuItems",
        include: {
          model: Product,
          as: "Product",
        },
      },
    });
    if (!menu) return res.status(404).json({ error: "Menu not found" });
    res.json(menu);
  } catch (error) {
    console.error("Error fetching menu:", error);
    res.status(500).json({ error: "Failed to fetch menu" });
  }
});


router.get("/:dayOfWeek", async (req, res) => {
  const { dayOfWeek } = req.params;

  try {
    const menu = await Menu.findOne({
      where: { DayOfWeek: dayOfWeek },
      include: {
        model: MenuItem,
        as: "MenuItems",
        include: {
          model: Product,
          as: "Product",
        },
      },
    });

    if (!menu) return res.status(404).json({ error: "Menu not found" });
    res.json(menu);
  } catch (error) {
    console.error("Error fetching menu:", error);
    res.status(500).json({ error: "Failed to fetch menu" });
  }
});

router.post("/apply-preset", authenticateToken, isAdmin, async (req, res) => {
  const { PresetMenuID, DayOfWeek } = req.body;

  try {
    const presetMenu = await Menu.findByPk(PresetMenuID, { include: MenuItem });

    if (!presetMenu)
      return res.status(404).json({ error: "Preset menu not found" });

    let menu = await Menu.findOne({ where: { DayOfWeek } });

    if (menu) {
      await menu.update({ IsPublic: true });
    } else {
      menu = await Menu.create({ DayOfWeek, IsPublic: true });
    }

    await MenuItem.destroy({ where: { MenuID: menu.MenuID } });
    const items = presetMenu.MenuItems.map((item) => ({
      MenuID: menu.MenuID,
      ProductID: item.ProductID,
      CustomPrice: item.CustomPrice,
    }));
    await MenuItem.bulkCreate(items);

    res.json(menu);
  } catch (error) {
    res.status(500).json({ error: "Failed to apply preset menu" });
  }
});

router.delete("/:id", authenticateToken, isAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const menu = await Menu.findByPk(id);
    if (!menu) return res.status(404).json({ error: "Menu not found" });
    await menu.destroy();
    res.json({ message: "Menu deleted successfully" });
  } catch (error) {
    console.error("Error deleting menu:", error);
    res.status(500).json({ error: "Failed to delete menu" });
  }
});

router.patch(
  "/toggle-visibility/:id",
  authenticateToken,
  isAdmin,
  async (req, res) => {
    const { id } = req.params;
    const { IsPublic } = req.body;

    try {

      const menu = await Menu.findByPk(id);
      if (!menu) return res.status(404).json({ error: "Menu not found" });

      await menu.update({ IsPublic });

      res.json(menu);
    } catch (error) {
      console.error("Error toggling menu visibility:", error);
      res.status(500).json({ error: "Failed to toggle menu visibility" });
    }
  }
);
module.exports = router;