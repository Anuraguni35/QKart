import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";
 

const ProductCard = ({ product, handleAddToCart }) => {
  return (
  <>
    <Card className="card" sx={{ maxWidth: 1, height: 1 }}>
      <CardMedia
        
      > <img src={product.image} alt={product.name} style={{width:"371px"}} /> 
      </CardMedia>
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          {product.name}
        </Typography>
        <Typography variant="p" color="black">
          ${product.cost}
        </Typography>
        <Typography component="legend">
          <Rating name="readOnly" value={product.rating} readOnly />
        </Typography>

      </CardContent><CardActions>
        <Button size="large" sx={{ width: 1 }} style={{ backgroundColor: "rgb(72 159 123)", color: "white" }} startIcon={<AddShoppingCartOutlined />} onClick={(e)=>{handleAddToCart( product._id) }}> ADD TO CART</Button>

      </CardActions>
    </Card>
   </>
  );
};

export default ProductCard;
