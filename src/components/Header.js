import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack   } from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

const Header = ({children,checkuser, hasHiddenAuthButtons }) => {
  
  const clearuser=()=>{
    localStorage.clear();
    window.location.reload();
    return;
  }

    return (
      <Box className="header">
        <Box className="header-title">
            <img src="logo_light.svg" alt="QKart-icon"></img>
        </Box>
        { children}
        {hasHiddenAuthButtons===true?<Link to="/"  className="explore-button"><Button
          className="explore-button"
          startIcon={<ArrowBackIcon />}
          variant="text">
          Back to explore
        </Button></Link>: checkuser[0]===true ?
        
        <Stack direction='row'spacing={0}>

       <Avatar src="avatar.png" alt={checkuser[1]} />
       <Button style={{color:"black"}} variant="text">{checkuser[1]}</Button>
        <Button variant="text" onClick={(e)=>{clearuser(e)}} ><Link style={{textDecoration:"none",color:"#00a278" }} to="/" >Logout</Link></Button>
   
   </Stack>  : <Stack
  direction="row"
  spacing={1}
>
<Link style={{textDecoration:"none" }} to={"/login"}> <Button variant="text"> Login</Button></Link>
<Link style={{textDecoration:"none" }} to={"/register"}><Button variant="contained"> Register</Button></Link>
   
</Stack>} 
      </Box>
    );
};

export default Header;
