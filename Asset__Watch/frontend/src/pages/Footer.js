import React from "react";
import { Box, Container, Grid, Link, Typography, useMediaQuery, useTheme } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faTwitter, faInstagram } from "@fortawesome/free-brands-svg-icons";
import { ReactComponent as Logo } from "../components/logo_assetwatch_schwarz.svg";

const Footer = () => {
  const theme = useTheme();
  const matchesSM = useMediaQuery(theme.breakpoints.up("sm"));

  return (
    <Box
      component='footer'
      sx={{ background: "linear-gradient(45deg, #2f4d65 30%, #796f6d 90%)", py: 3 }}
    >
      <Container maxWidth='lg'>
        <Grid container spacing={4} alignItems='center'>
          {/* Logo on the left */}
          <Grid item xs={12} sm={4} md={3}>
            <Box display='flex' justifyContent={{ xs: "center", sm: "flex-start" }}>
              <Link href='/home'>
                <Logo
                  style={{ height: "100px", maxWidth: "100%", margin: "0 auto" }}
                  alt='Asset Watch'
                />
              </Link>
            </Box>
          </Grid>

          {/* Social media icons centered */}
          <Grid item xs={12} sm={4} md={6}>
            <Box display='flex' justifyContent='space-between' mx={{ xs: 2, sm: 10 }}>
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

          {/* Attribution text on the right */}
          <Grid item xs={12} sm={4} md={3}>
            <Typography
              variant='subtitle1'
              color='text.secondary'
              align={matchesSM ? "right" : "center"} // Use conditional rendering based on the screen size
            >
              Made by Egor Chetverikov &copy; {new Date().getFullYear()}
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;
