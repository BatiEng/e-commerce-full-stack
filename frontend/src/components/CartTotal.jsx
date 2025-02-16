import { useContext, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";

function CartTotal() {
  const {
    currency,
    deliveryFee,
    totalCartValue,
    totalCartValueCalculate,
    cartItems,
  } = useContext(ShopContext);

  useEffect(() => {
    totalCartValueCalculate();
  }, [cartItems]);
  return (
    <div className="w-full">
      <div className="text-2xl">
        <Title text1={"CART"} text2={"TOTALS"} />
      </div>
      <div className="flex flex-col gap-2 mt-2 text-sm">
        <div className="flex justify-between">
          <p>Subtotal</p>
          <p>
            {currency} {totalCartValue}.00
          </p>
        </div>
        <hr />
        <div className="flex justify-between">
          <p>Shipphing Fee</p>
          <p>
            {currency} {deliveryFee}.00
          </p>
        </div>
        <hr />
        <div className="flex justify-between">
          <p>Total</p>
          <p>
            {currency} {totalCartValue === 0 ? 0 : totalCartValue + deliveryFee}
            .00
          </p>
        </div>
      </div>
    </div>
  );
}

export default CartTotal;
