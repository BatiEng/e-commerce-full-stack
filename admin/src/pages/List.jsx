import axios from "axios";
import { backendURL, currency } from "./../App.jsx";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function List({ token }) {
  const [products, setProducts] = useState([]);
  const getAllProduct = async () => {
    try {
      const response = await axios.get(backendURL + "/api/product/products");

      if (response.data.success) {
        setProducts(response.data.data);
      } else {
        toast.error(response.data.message, { autoClose: 1000 });
      }
    } catch (err) {
      toast.error(response.data.message, { autoClose: 1000 });
      console.log(err);
    }
  };

  const removeProduct = async (id) => {
    try {
      const response = await axios.delete(
        backendURL + `/api/product/product/${id}`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        toast.success(response.data.message, { autoClose: 1000 });
        getAllProduct();
      } else {
        toast.error(response.data.message, { autoClose: 1000 });
      }
    } catch (err) {
      toast.error(response.data.message, { autoClose: 1000 });
      console.log(err);
    }
  };

  useEffect(() => {
    getAllProduct();
  }, []);
  return (
    <div>
      <p className="mb-2">All products list</p>
      <div className="flex flex-col gap-2">
        {/*----------List table title ------------*/}
        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className="text-center">Action</b>
        </div>

        {/*----------Product List---------------------------- */}
        {products.map((item, index) => (
          <div
            className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm"
            key={index}
          >
            <img className="w-12" src={item.image[0]} alt="" />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>
              {currency} {item.price}
            </p>
            <p
              onClick={() => removeProduct(item._id)}
              className="text-right md:text-center cursor-pointer text-lg"
            >
              X
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default List;
