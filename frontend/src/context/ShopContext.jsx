import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { toast } from "react-toastify";

export const ShopContext = createContext({
  products: [],
  currency: "$",
  deliveryFee: 0,
});

const ShopContextProvider = ({ children }) => {
  const currency = "$";
  const deliveryFee = 10;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItemsQuantity, setCartItemsQuantity] = useState(0);
  const [cartItems, setCartItems] = useState({});
  const [totalCartValue, setTotalCartValue] = useState(0);
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const [token, setToken] = useState(() => {
    const storedToken = localStorage.getItem("token");
    return storedToken ? storedToken : null;
  });
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [cartData, setCartData] = useState([]);

  const getAllProduct = async () => {
    try {
      const response = await axios.get(backendURL + "/api/product/products");

      if (response.data.success) {
        setProducts(response.data.data);
      } else {
      }
    } catch (err) {
      console.log(err);
    }
  };

  const totalCartValueCalculate = () => {
    let total = 0;
    let cartData = structuredClone(cartItems);
    for (const items in cartData) {
      const product = products.find((item) => item._id === items);
      for (const item in cartData[items]) {
        try {
          if (cartData[items][item] > 0) {
            total += product.price * cartData[items][item];
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
    setTotalCartValue(total);
  };

  const addToCart = async (id, size) => {
    let cartData = structuredClone(cartItems);
    if (!size) {
      toast.error("select product size", { autoClose: 1000 });
      return;
    }
    if (cartData[id]) {
      if (cartData[id][size]) {
        cartData[id][size] += 1;
      } else {
        cartData[id][size] = 1;
      }
    } else {
      cartData[id] = {};
      cartData[id][size] = 1;
    }

    setCartItems(cartData);
    setCartItemsQuantity(cartItemsQuantity + 1);
    if (token) {
      try {
        const response = await axios.post(
          backendURL + "/api/cart/add",
          { userID: user._id, itemID: id, size },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          toast.success("Product added to the cart", { autoClose: 1000 });
        }
      } catch (err) {
        console.log(err);
        toast.error(err, { autoClose: 2000 });
      }
    }
  };

  const updateQuantity = async (id, size, newQuantity) => {
    let cartData = structuredClone(cartItems);
    const oldQuantity = cartData[id]?.[size] || 0; // Get the previous quantity

    cartData[id][size] = newQuantity; // Update the quantity

    // Adjust cartItemsQuantity based on the difference
    setCartItemsQuantity(
      (prevQuantity) => prevQuantity - oldQuantity + newQuantity
    );

    setCartItems(cartData);

    if (token) {
      try {
        const response = await axios.post(
          backendURL + "/api/cart/update",
          { userID: user._id, itemID: id, size, quantity: newQuantity },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.success) {
        }
      } catch (err) {
        toast.error(err, { autoClose: 2000 });
      }
    }
  };

  const calculateTotalProduct = async () => {
    let cartQuantity = 0;
    const tempData = [];
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        if (cartItems[items][item] > 0) {
          cartQuantity += cartItems[items][item];
          tempData.push({
            _id: items,
            size: item,
            quantity: cartItems[items][item],
          });
        }
      }
    }

    setCartItemsQuantity(cartQuantity);
    setCartData(tempData);
  };

  const getUserCart = async () => {
    try {
      const response = await axios.post(
        backendURL + "/api/cart/get",
        { userID: user._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setCartItems(response.data.cartData);
      }
    } catch (err) {
      console.log(err);
      toast.error(err, { autoClose: 2000 });
    }
  };

  useEffect(() => {
    calculateTotalProduct();
  }, [cartItems]);

  useEffect(() => {
    getAllProduct();
    if (token) {
      getUserCart();
    }
  }, [token]);

  const value = {
    products,
    currency,
    deliveryFee,
    setSearch,
    setShowSearch,
    showSearch,
    search,
    cartItems,
    addToCart,
    cartItemsQuantity,
    setCartItemsQuantity,
    setCartItems,
    updateQuantity,
    totalCartValue,
    totalCartValueCalculate,
    navigate,
    backendURL,
    token,
    setToken,
    user,
    setUser,
    cartData,
    calculateTotalProduct,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export default ShopContextProvider;
