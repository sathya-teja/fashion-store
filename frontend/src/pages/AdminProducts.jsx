// AdminProducts.jsx
import { useEffect, useState } from "react";
import API from "../utils/axios";
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Checkbox,
  FormControlLabel,
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { toast } from "react-toastify";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const defaultForm = {
    name: "",
    brand: "",
    description: "",
    price: "",
    discountPrice: "",
    imageUrl: "",
    images: [],
    gender: "",
    type: "",
    style: "",
    season: "",
    isFeatured: false,
    isBestseller: false,
    countInStock: "",
    sku: "",
    weight: "",
    dimensions: { length: "", width: "", height: "" },
    sizes: [],
    colors: [],
    tags: [],
    meta: { title: "", description: "" },
  };

  const [form, setForm] = useState(defaultForm);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const fetchProducts = async () => {
    try {
      const { data } = await API.get("/products");
      setProducts(data.products);
    } catch (err) {
      toast.error("Failed to fetch products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpen = (product = null) => {
    if (product) {
      setEditing(product._id);
      setForm({
        ...defaultForm,
        ...product,
        dimensions: product.dimensions || { length: "", width: "", height: "" },
        sizes: product.sizes || [],
        colors: product.colors || [],
        tags: product.tags || [],
        meta: product.meta || { title: "", description: "" },
      });
    } else {
      setEditing(null);
      setForm(defaultForm);
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSave = async () => {
    try {
      if (editing) {
        await API.put(
          `/products/${editing}`,
          form,
          { headers: { Authorization: `Bearer ${userInfo.token}` } }
        );
        toast.success("Product updated!");
      } else {
        await API.post("/products", form, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        toast.success("Product created!");
      }
      handleClose();
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save product");
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/products/${id}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      toast.success("Product deleted!");
      fetchProducts();
    } catch (err) {
      toast.error("Failed to delete product");
    }
  };

  // --- Helpers for dynamic arrays ---
  const updateSize = (i, key, value) => {
    const sizes = [...form.sizes];
    sizes[i][key] = value;
    setForm({ ...form, sizes });
  };
  const updateColor = (i, key, value) => {
    const colors = [...form.colors];
    colors[i][key] = value;
    setForm({ ...form, colors });
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Manage Products
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpen()}
        sx={{ mb: 2 }}
      >
        Add Product
      </Button>

      {/* Table of products */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Featured</TableCell>
              <TableCell>Bestseller</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((p) => (
              <TableRow key={p._id}>
                <TableCell>{p.name}</TableCell>
                <TableCell>₹{p.price}</TableCell>
                <TableCell>{p.countInStock}</TableCell>
                <TableCell>{p.isFeatured ? "Yes" : "No"}</TableCell>
                <TableCell>{p.isBestseller ? "Yes" : "No"}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleOpen(p)}>
                    <Edit />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(p._id)}
                    color="error"
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {editing ? "Edit Product" : "Add Product"}
        </DialogTitle>
        <DialogContent dividers>
          <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
            <TextField
              label="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <TextField
              label="Brand"
              value={form.brand}
              onChange={(e) => setForm({ ...form, brand: e.target.value })}
            />
            <TextField
              label="Price"
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
            />
            <TextField
              label="Discount Price"
              type="number"
              value={form.discountPrice}
              onChange={(e) =>
                setForm({ ...form, discountPrice: Number(e.target.value) })
              }
            />
            <TextField
              label="Stock Count"
              type="number"
              value={form.countInStock}
              onChange={(e) =>
                setForm({ ...form, countInStock: Number(e.target.value) })
              }
            />
            <TextField
              label="Main Image URL"
              value={form.imageUrl}
              onChange={(e) =>
                setForm({ ...form, imageUrl: e.target.value })
              }
            />
            <TextField
              label="SKU"
              value={form.sku}
              onChange={(e) => setForm({ ...form, sku: e.target.value })}
            />
            <TextField
              label="Weight (kg)"
              type="number"
              value={form.weight}
              onChange={(e) =>
                setForm({ ...form, weight: Number(e.target.value) })
              }
            />
            <TextField
              label="Dimensions (L x W x H)"
              value={`${form.dimensions.length} x ${form.dimensions.width} x ${form.dimensions.height}`}
              onChange={(e) => {
                const [length, width, height] = e.target.value.split("x");
                setForm({
                  ...form,
                  dimensions: {
                    length: Number(length?.trim() || 0),
                    width: Number(width?.trim() || 0),
                    height: Number(height?.trim() || 0),
                  },
                });
              }}
            />

            {/* Gender */}
            <FormControl fullWidth>
              <InputLabel>Gender</InputLabel>
              <Select
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
              >
                <MenuItem value="Men">Men</MenuItem>
                <MenuItem value="Women">Women</MenuItem>
                <MenuItem value="Unisex">Unisex</MenuItem>
              </Select>
            </FormControl>

            {/* Type */}
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <MenuItem value="Shirt">Shirt</MenuItem>
                <MenuItem value="T-Shirt">T-Shirt</MenuItem>
                <MenuItem value="Jeans">Jeans</MenuItem>
                <MenuItem value="Shoes">Shoes</MenuItem>
                <MenuItem value="Accessories">Accessories</MenuItem>
              </Select>
            </FormControl>

            {/* Style */}
            <FormControl fullWidth>
              <InputLabel>Style</InputLabel>
              <Select
                value={form.style}
                onChange={(e) => setForm({ ...form, style: e.target.value })}
              >
                <MenuItem value="Casual">Casual</MenuItem>
                <MenuItem value="Formal">Formal</MenuItem>
                <MenuItem value="Sport">Sport</MenuItem>
              </Select>
            </FormControl>

            {/* Season */}
            <FormControl fullWidth>
              <InputLabel>Season</InputLabel>
              <Select
                value={form.season}
                onChange={(e) => setForm({ ...form, season: e.target.value })}
              >
                <MenuItem value="Summer">Summer</MenuItem>
                <MenuItem value="Winter">Winter</MenuItem>
                <MenuItem value="All Season">All Season</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Sizes */}
          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            Sizes
          </Typography>
          {form.sizes.map((s, i) => (
            <Box key={i} display="flex" gap={1} mt={1}>
              <TextField
                label="Size"
                value={s.size}
                onChange={(e) => updateSize(i, "size", e.target.value)}
              />
              <TextField
                label="Stock"
                type="number"
                value={s.stock}
                onChange={(e) => updateSize(i, "stock", Number(e.target.value))}
              />
            </Box>
          ))}
          <Button
            size="small"
            onClick={() =>
              setForm({ ...form, sizes: [...form.sizes, { size: "", stock: "" }] })
            }
          >
            + Add Size
          </Button>

          {/* Colors */}
          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            Colors
          </Typography>
          {form.colors.map((c, i) => (
            <Box key={i} display="flex" gap={1} mt={1}>
              <TextField
                label="Name"
                value={c.name}
                onChange={(e) => updateColor(i, "name", e.target.value)}
              />
              <TextField
                label="Hex"
                value={c.hex}
                onChange={(e) => updateColor(i, "hex", e.target.value)}
              />
              <TextField
                label="Stock"
                type="number"
                value={c.stock}
                onChange={(e) => updateColor(i, "stock", Number(e.target.value))}
              />
            </Box>
          ))}
          <Button
            size="small"
            onClick={() =>
              setForm({
                ...form,
                colors: [...form.colors, { name: "", hex: "", stock: "" }],
              })
            }
          >
            + Add Color
          </Button>

          {/* Description + Meta */}
          <TextField
            label="Description"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            fullWidth
            multiline
            rows={3}
            sx={{ mt: 2 }}
          />
          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            SEO Meta
          </Typography>
          <TextField
            label="Meta Title"
            value={form.meta.title}
            onChange={(e) =>
              setForm({ ...form, meta: { ...form.meta, title: e.target.value } })
            }
            fullWidth
          />
          <TextField
            label="Meta Description"
            value={form.meta.description}
            onChange={(e) =>
              setForm({
                ...form,
                meta: { ...form.meta, description: e.target.value },
              })
            }
            fullWidth
            multiline
            rows={2}
            sx={{ mt: 1 }}
          />

          {/* Featured/Bestseller */}
          <FormControlLabel
            control={
              <Checkbox
                checked={form.isFeatured}
                onChange={(e) =>
                  setForm({ ...form, isFeatured: e.target.checked })
                }
              />
            }
            label="Featured"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={form.isBestseller}
                onChange={(e) =>
                  setForm({ ...form, isBestseller: e.target.checked })
                }
              />
            }
            label="Bestseller"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
