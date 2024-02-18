import React from "react";
import { Box, Container, Grid, Link, Typography, useMediaQuery, useTheme } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faTwitter, faInstagram } from "@fortawesome/free-brands-svg-icons";
import { ReactComponent as Logo } from "../components/logo_assetwatch_schwarz.svg";

const Footer = () => {
  const theme = useTheme();
  const matchesSM = useMediaQuery(theme.breakpoints.up("sm"));
  // Custom media query for screen sizes between 600px and 900px
  const between600And900 = useMediaQuery("(min-width:600px) and (max-width:900px)");

  return (
    <Box
      component='footer'
      sx={{ background: "linear-gradient(45deg, #2f4d65 30%, #796f6d 90%)", py: 3 }}
    >
      <Container maxWidth='lg'>
        <Grid container spacing={4} alignItems='center'>
          <Grid item xs={12} sm={4} md={3}>
            <Typography
              variant='subtitle1'
              color='black.paper'
              align={matchesSM ? "right" : "center"}
            >
              Made by Egor Chetverikov &copy; {new Date().getFullYear()}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={4} md={6}>
            <Box
              display='flex'
              justifyContent='space-between'
              mx={{
                xs: 2, // for extra small devices
                sm: between600And900 ? 3 : 8, // adjust margin for screens between 600px and 900px
                md: 10, // for medium devices and up
              }}
            >
              <Link href='https://www.facebook.com/' target='_blank' color='inherit'>
                <FontAwesomeIcon icon={faFacebookF} size='2x' />
              </Link>
              <Link href='https://twitter.com/' target='_blank' color='inherit'>
                <FontAwesomeIcon icon={faTwitter} size='2x' />
              </Link>
              <Link href='https://www.instagram.com/' target='_blank' color='inherit'>
                <FontAwesomeIcon icon={faInstagram} size='2x' />
              </Link>
            </Box>
          </Grid>

          <Grid item xs={12} sm={4} md={3}>
            <Box display='flex' justifyContent={{ xs: "center", sm: "flex-end" }}>
              <Link href='/home'>
                <Logo
                  style={{ height: "100px", maxWidth: "100%", margin: "0 auto" }}
                  alt='Asset Watch'
                />
              </Link>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;
