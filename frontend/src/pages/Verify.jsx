import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";

function Verify() {
  const { navigate, token, setCartItems, backendURL, user } =
    useContext(ShopContext);

  const [searchParams, setSearchParams] = useSearchParams();

  const success = searchParams.get("success");
  const orderID = searchParams.get("orderID");

  const verifyPayment = async () => {
    try {
      if (!token) {
        return null;
      }

      const response = await axios.post(
        backendURL + "/api/order/verify-stripe",
        { userID: user._id, success, orderID },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setCartItems({});
        navigate("/orders");
      } else {
        navigate("/cart");
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    verifyPayment();
  }, []);
  return <div>adasdasd</div>;
}

export default Verify;
