import { useContext, useEffect, useState } from "react";
import { assets } from "../assets/frontend_assets/assets";
import CartTotal from "../components/CartTotal";
import Title from "../components/Title";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import axios from "axios";

function PlaceOrder() {
  const [method, setMethod] = useState("cod");
  const {
    navigate,
    user,
    backendURL,
    token,
    cartItems,
    setCartItems,
    deliveryFee,
    totalCartValue,
    products,
  } = useContext(ShopContext);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: user.email ? user.email : "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const onChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setFormData((data) => ({ ...data, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("onsubmit");
      let orderItems = [];

      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(
              products.find((pro) => pro._id === items)
            );

            if (itemInfo) {
              itemInfo.size = item;
              itemInfo.quantity = cartItems[items][item];
              orderItems.push(itemInfo);
            }
          }
        }
      }

      let orderData = {
        userID: user._id,
        address: formData,
        items: orderItems,
        amount: totalCartValue + deliveryFee,
      };

      switch (method) {
        case "cod":
          console.log("ici");
          const response = await axios.post(
            backendURL + "/api/order/place",
            orderData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (response.data.success) {
            toast.success(response.data.message, { autoClose: 1000 });
            setCartItems({});
            navigate("orders");
          } else {
            toast.error(response.data.message);
          }
          break;
        case "stripe":
          const responseStripe = await axios.post(
            backendURL + "/api/order/place-stripe",
            orderData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (responseStripe.data.success) {
            const { session_url } = responseStripe.data;
            window.location.replace(session_url);
          } else {
            toast.error(response.data.message, { autoClose: 2000 });
          }
          break;

        default:
          break;
      }

      // const response = await axios.post(backendURL + "/api/order/place");
      // console.log(response);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t"
    >
      {/* ------------left side------------ */}
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className="text-xl sm:text-2xl my-3">
          <Title text1={"DELIVERY"} text2={"INFORMATION"} />
        </div>
        <div className="flex gap-3">
          <input
            required
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="First name"
            onChange={onChange}
            name="firstName"
            value={formData.firstName}
          />

          <input
            required
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="Last name"
            onChange={onChange}
            name="lastName"
            value={formData.lastName}
          />
        </div>
        <input
          required
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          type="email"
          placeholder="Email Adsress"
          onChange={onChange}
          name="email"
          value={formData.email}
        />
        <input
          required
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          type="text"
          placeholder="Street"
          onChange={onChange}
          name="street"
          value={formData.street}
        />
        <div className="flex gap-3">
          <input
            required
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="City"
            onChange={onChange}
            name="city"
            value={formData.city}
          />

          <input
            required
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="State"
            onChange={onChange}
            name="state"
            value={formData.state}
          />
        </div>
        <div className="flex gap-3">
          <input
            required
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="number"
            placeholder="Zipcode"
            onChange={onChange}
            name="zipcode"
            value={formData.zipcode}
          />

          <input
            required
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="Country"
            onChange={onChange}
            name="country"
            value={formData.country}
          />
        </div>
        <input
          required
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          type="number"
          placeholder="Phone (without 0)"
          onChange={onChange}
          name="phone"
          value={formData.phone}
        />
      </div>
      {/* -----------Right side------------- */}
      <div className="mt-8">
        <div className="mt-8 min-w-80">
          <CartTotal />
        </div>
        <div className="mt-12">
          <Title text1={"PAYMENT"} text2={"METHOD"} />
          {/* -----------Payment method selection------------- */}

          <div className="flex gap-3 flex-col lg:flex-row">
            <div
              onClick={() => setMethod("stripe")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full  ${
                  method === "stripe" ? "bg-green-400" : ""
                }`}
              ></p>
              <img className="h-5 mx-4" src={assets.stripe_logo} alt="" />
            </div>
            <div
              onClick={() => setMethod("razorpay")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full  ${
                  method === "razorpay" ? "bg-green-400" : ""
                }`}
              ></p>
              <img className="h-5 mx-4" src={assets.razorpay_logo} alt="" />
            </div>
            <div
              onClick={() => setMethod("cod")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full  ${
                  method === "cod" ? "bg-green-400" : ""
                }`}
              ></p>
              <p className="text-gray-500 text-sm font-medium">
                CASH ON DELIVERY
              </p>
            </div>
          </div>
          <div className="w-full text-end mt-8">
            <button
              type="submit"
              className="bg-black text-white px-16 py-3 text-sm cursor-pointer"
            >
              PLACE ORDER
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default PlaceOrder;
