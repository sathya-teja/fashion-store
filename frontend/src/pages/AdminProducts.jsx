import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    discountPrice: "",
    imageUrl: "",
    gender: "",
    type: "",
    style: "",
    season: "",
    isFeatured: false,
    isBestseller: false,
    countInStock: "",
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  // ✅ Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/products");
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch products");
        setProducts(data.products || []);
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      }
    };
    fetchProducts();
  }, []);

  // ✅ Handle form changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // ✅ Add or Update Product
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingProduct
        ? `http://localhost:5000/api/products/${editingProduct._id}`
        : "http://localhost:5000/api/products";
      const method = editingProduct ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save product");

      if (editingProduct) {
        setProducts((prev) =>
          prev.map((p) => (p._id === data._id ? data : p))
        );
        toast.success("✅ Product updated successfully!");
      } else {
        setProducts((prev) => [...prev, data]);
        toast.success("✅ Product added successfully!");
      }

      // Reset form
      setFormData({
        name: "",
        description: "",
        price: "",
        discountPrice: "",
        imageUrl: "",
        gender: "",
        type: "",
        style: "",
        season: "",
        isFeatured: false,
        isBestseller: false,
        countInStock: "",
      });
      setEditingProduct(null);
    } catch (err) {
      toast.error(err.message);
    }
  };

  // ✅ Edit Product
  const handleEdit = (product) => {
    setFormData({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      discountPrice: product.discountPrice || "",
      imageUrl: product.imageUrl || "",
      gender: product.gender || "",
      type: product.type || "",
      style: product.style || "",
      season: product.season || "",
      isFeatured: product.isFeatured || false,
      isBestseller: product.isBestseller || false,
      countInStock: product.countInStock || "",
    });
    setEditingProduct(product);
    toast.info("✏️ Editing product...");
  };

  // ✅ Delete Product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      if (!res.ok) throw new Error("Failed to delete product");
      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast.success("🗑️ Product deleted successfully!");
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (!userInfo?.isAdmin) return <p>Access denied. Admins only.</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 border rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Admin – Manage Products</h1>

      {/* ✅ Product Form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
      >
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="border px-4 py-2 rounded"
          required
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          className="border px-4 py-2 rounded"
          required
        />

        <input
          type="number"
          name="discountPrice"
          placeholder="Discount Price"
          value={formData.discountPrice}
          onChange={handleChange}
          className="border px-4 py-2 rounded"
        />

        <input
          type="text"
          name="imageUrl"
          placeholder="Image URL"
          value={formData.imageUrl}
          onChange={handleChange}
          className="border px-4 py-2 rounded"
          required
        />

        {/* ✅ Dropdowns for enums */}
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="border px-4 py-2 rounded"
          required
        >
          <option value="">Select Gender</option>
          <option value="Men">Men</option>
          <option value="Women">Women</option>
          <option value="Kids">Kids</option>
          <option value="Unisex">Unisex</option>
        </select>

        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="border px-4 py-2 rounded"
          required
        >
          <option value="">Select Type</option>
          <option value="Shirt">Shirt</option>
          <option value="T-Shirt">T-Shirt</option>
          <option value="Pants">Pants</option>
          <option value="Jeans">Jeans</option>
          <option value="Dress">Dress</option>
          <option value="Shoes">Shoes</option>
          <option value="Accessories">Accessories</option>
        </select>

        <select
          name="style"
          value={formData.style}
          onChange={handleChange}
          className="border px-4 py-2 rounded"
        >
          <option value="">Select Style</option>
          <option value="Casual">Casual</option>
          <option value="Formal">Formal</option>
          <option value="Party">Party</option>
          <option value="Ethnic">Ethnic</option>
          <option value="Sportswear">Sportswear</option>
        </select>

        <select
          name="season"
          value={formData.season}
          onChange={handleChange}
          className="border px-4 py-2 rounded"
        >
          <option value="">Select Season</option>
          <option value="Summer">Summer</option>
          <option value="Winter">Winter</option>
          <option value="All-Season">All-Season</option>
        </select>

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="border px-4 py-2 rounded col-span-2"
          required
        />

        <input
          type="number"
          name="countInStock"
          placeholder="Stock Count"
          value={formData.countInStock}
          onChange={handleChange}
          className="border px-4 py-2 rounded"
          required
        />

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="isFeatured"
            checked={formData.isFeatured}
            onChange={handleChange}
          />
          <span>Featured</span>
        </label>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="isBestseller"
            checked={formData.isBestseller}
            onChange={handleChange}
          />
          <span>Bestseller</span>
        </label>

        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 col-span-2"
        >
          {editingProduct ? "Update Product" : "Add Product"}
        </button>
      </form>

      {/* ✅ Product List */}
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Name</th>
            <th className="border p-2">Price</th>
            <th className="border p-2">Stock</th>
            <th className="border p-2">Featured</th>
            <th className="border p-2">Bestseller</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id} className="text-center">
              <td className="border p-2">{p.name}</td>
              <td className="border p-2">₹{p.price}</td>
              <td className="border p-2">{p.countInStock}</td>
              <td className="border p-2">{p.isFeatured ? "✅" : "❌"}</td>
              <td className="border p-2">{p.isBestseller ? "✅" : "❌"}</td>
              <td className="border p-2 space-x-2">
                <button
                  onClick={() => handleEdit(p)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

  {/* ToastContainer is now rendered globally in App.jsx */}
    </div>
  );
};

export default AdminProducts;
