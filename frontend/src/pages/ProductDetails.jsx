import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch product details');
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
      <img src={product.imageUrl} alt={product.name} className="w-full max-w-md mb-4" />
      <p className="text-gray-700 mb-2">{product.description}</p>
      <p className="text-lg font-semibold mb-4">₹{product.price}</p>
      <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
        Add to Cart
      </button>
    </div>
  );
};

export default ProductDetails;
