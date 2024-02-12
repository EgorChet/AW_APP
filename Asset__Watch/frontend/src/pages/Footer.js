import React from "react";
import { Box, Container, Grid, Link, Typography } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faTwitter, faInstagram } from "@fortawesome/free-brands-svg-icons";
import { ReactComponent as Logo } from "../components/logo_assetwatch_schwarz.svg";

const Footer = () => {
  return (
    <Box
      component='footer'
      sx={{ background: "linear-gradient(45deg, #2f4d65 30%, #796f6d 90%)", py: 3 }}
    >
      <Container maxWidth='lg'>
        <Grid container spacing={4} alignItems='center'>
          {/* Logo on the left */}
          <Grid item xs={12} sm={4} md={3}>
            <Box display='flex' justifyContent='flex-start' marginRight={10}>
              <Logo style={{ height: "100px" }} alt='Asset Watch' />
            </Box>
          </Grid>

          {/* Social media icons centered */}
          <Grid item xs={12} sm={4} md={6}>
            <Box display='flex' justifyContent='space-between' marginLeft={10} marginRight={10}>
              <Link href='#' color='inherit'>
                <FontAwesomeIcon icon={faFacebookF} size='2x' />
              </Link>
              <Link href='#' color='inherit'>
                <FontAwesomeIcon icon={faTwitter} size='2x' />
              </Link>
              <Link href='#' color='inherit'>
                <FontAwesomeIcon icon={faInstagram} size='2x' />
              </Link>
            </Box>
          </Grid>

          {/* Attribution text on the right */}
          <Grid item xs={12} sm={4} md={3}>
            <Typography variant='subtitle1' color='text.secondary' align='right'>
              Made by Egor Chetverikov &copy; {new Date().getFullYear()}
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;
