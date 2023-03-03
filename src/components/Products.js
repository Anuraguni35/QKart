import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import ProductCard from "./ProductCard";
import "./Products.css";
import Cart from "./Cart"
import { generateCartItemsFrom } from "./Cart";
import { PresentToAll } from "@mui/icons-material";

// Definition of Data Structures used
/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 * @typedef {Object} Product - Data on product available to buy
 * @property {string} qty - The quantity of product added to cart
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */


const Products = () => {
  const [Product, setproduct] = useState([])
  const [loading, setloading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [ProductList, setProductList] = useState("NotEmpty");
  const { enqueueSnackbar } = useSnackbar();
  const [debounceTimeout, setdebounceTimeout] = useState(0);
  const [CartItem,setCartItem]=useState()
  useEffect(() => {
    performAPICall();
  }, [])

  useEffect(() => {
    debounceSearch(searchText, debounceTimeout);
  }, [searchText])
  
  useEffect(()=>{
   fetchCart(localStorage.getItem("token")).then(e=>{ 
     
    setCartItem(generateCartItemsFrom(e,Product));
    
    });
  },[Product])
   
  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  const performAPICall = async () => {
    await axios.get(`${config.endpoint}/products`).then((e) => {
      setloading(false);
      setproduct(e.data);
    }).catch(e => {
      enqueueSnackbar(e.message, { variant: "error" })
    });

  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {
    setloading(true)
    let url = `${config.endpoint}/products`
    if (text) {
      url = `${config.endpoint}/products/search?value=${text}`;
    }
    await axios.get(`${url}`).then((e) => {
      setloading(false);
      setProductList("NotEmpty");
      setproduct(e.data);
    }).catch(e => {
      setloading(false)
      setProductList("Empty");
      setproduct([]);
    });
    ;
  }

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const debounceSearch = (event, debounceTimeout) => {

    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    let newTimer = setTimeout(() => {
      performSearch(event);
    }, 500)
    setdebounceTimeout(newTimer);
  };


  /**
     * Perform the API call to fetch the user's cart and return the response
     *
     * @param {string} token - Authentication token returned on login
     *
     * @returns { Array.<{ productId: string, qty: number }> | null }
     *    The response JSON object
     *
     * Example for successful response from backend:
     * HTTP 200
     * [
     *      {
     *          "productId": "KCRwjF7lN97HnEaY",
     *          "qty": 3
     *      },
     *      {
     *          "productId": "BW0jAAeDJmlZCF8i",
     *          "qty": 1
     *      }
     * ]
     *
     * Example for failed response from backend:
     * HTTP 401
     * {
     *      "success": false,
     *      "message": "Protected route, Oauth2 Bearer token not found"
     * }
     */
  const fetchCart = async (token) => {
    if (!token) return;

    try {
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
     let response=await axios.get(`${config.endpoint}/cart`,{ headers: {
      'Authorization': `Bearer ${token}`
      }});
      // console.log(response,"inside fetchcart" );
     return response.data; 
          


    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };


  // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */
  const isItemInCart = (items, productId) => {
    
     let check= items.find(e=>{ return e.productId===productId?true:false}) 
     return check; 
  };

  /**
   * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
   *
   * @param {string} token
   *    Authentication token returned on login
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { Array.<Product> } products
   *    Array of objects with complete data on all available products
   * @param {string} productId
   *    ID of the product that is to be added or updated in cart
   * @param {number} qty
   *    How many of the product should be in the cart
   * @param {boolean} options
   *    If this function was triggered from the product card's "Add to Cart" button
   *
   * Example for successful response from backend:
   * HTTP 200 - Updated list of cart items
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 404 - On invalid productId
   * {
   *      "success": false,
   *      "message": "Product doesn't exist"
   * }
   */
  const addToCart = async (
    token,
    items,
    products,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {
    
    //  if(!token){
      
    //   return;
    //  }
    //  if(isItemInCart(items,productId)){
    //   enqueueSnackbar(
    //     "Item already in cart. Use the cart sidebar to update quantity or remove item.",
    //     {
    //       variant: "warning",
    //     }
    //   );
     
    //   return;
    //  }
     try{
     let res=await axios.post(`${config.endpoint}/cart`,{"productId":productId,"qty":qty},{ headers: {
        'Authorization': `Bearer ${token}`}})
        setCartItem(generateCartItemsFrom(res.data,Product));
     }
     catch{ }
  };






  const checkuser = () => {
    let user = localStorage.getItem("username");

    if (user) {

      return [true, user];
    } else {
      return false;
    }
  }



  return (
    <div>
      <Header children={<TextField
        className="search-desktop "
        style={{ width: "50vh", justifyContent: "center" }}
        fullWidth
        value={searchText}
        onChange={(e) => { setSearchText(e.target.value) }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
      />} checkuser={checkuser()} hasHiddenAuthButtons={false}  >

      </Header>



      {/* Search view for mobiles */}
      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        value={searchText}
        onChange={(e) => { setSearchText(e.target.value) }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
      />
      <Grid container>
        <Grid item xs={checkuser()[0]===true?9:12} 
        lg={checkuser()[0]===true?9:12}  
        md={checkuser()[0]===true?9:12}
        sm={12}>
          <Grid container>
          <Grid item className="product-grid" >
            <Box className="hero">
              <p className="hero-heading">
                India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
                to your door step
              </p>
            </Box>
          </Grid>
          <Grid item className="product-grid">
            <Grid container spacing={2}>
              {loading === true ? <Grid item className="Progress " style={{ height: "40vh", marginTop: "20vh" }}> <Box className="Progress"  ><CircularProgress /><br /> Loading Products... </Box></Grid> :
                (ProductList === "Empty" ?
                  <Grid item className="Progress " style={{ height: "40vh", marginTop: "20vh" }}>
                    <Box>
                      <SentimentDissatisfied /><br />No products found
                    </Box>
                  </Grid>
                  :
                  Product.map((e) => {
                    let products = {
                      name: e.name,
                      category: e.category,
                      cost: e.cost,
                      rating: e.rating,
                      image: e.image,
                      _id: e._id
                    }
                    return (
                      <Grid item md={3} xs={6} className="product-grid" key={products._id}>
                        <ProductCard product={products} handleAddToCart={e=>{localStorage.getItem("token")? (isItemInCart(CartItem ,e)? enqueueSnackbar(
        "Item already in cart. Use the cart sidebar to update quantity or remove item.",
        {
          variant: "warning",
        }
      ):
                          addToCart(localStorage.getItem("token"),CartItem ,Product,e,1)):enqueueSnackbar(
        "Login to add an item to the Cart",
        {
          variant: "warning",
        }
      );}} />
                      </Grid>
                    )
                  }))}
               </Grid>
            </Grid>
          </Grid>
        
        
        
        </Grid>
        {checkuser()[0]===true&&<Grid item xs={3} lg={3} md={3} sm={12} style={{backgroundColor:"#E9F5E1"}}><Cart  Products={Product} items={CartItem}  handleQuantity={addToCart}/></Grid>}
      </Grid>
      <Footer />
    </div>
  );
};

export default Products;
