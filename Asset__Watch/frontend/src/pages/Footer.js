import React from 'react';
import { Box, Container, Grid, Link, Typography } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  return (
    <Box component="footer" sx={{ bgcolor: 'background.paper', py: 3 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="space-between" alignItems="center">
          <Grid item s={12} sm={4}>
            <Typography variant="subtitle1" color="text.secondary" align="center">
              &copy; {new Date().getFullYear()} Asset-Watch Inc
            </Typography>
          </Grid>
          <Grid item s={12} sm={4}>
            <Grid container justifyContent="space-evenly">
              <Link href="#" color="inherit">
                <FontAwesomeIcon icon={faFacebookF} />
              </Link>
              <Link href="#" color="inherit">
                <FontAwesomeIcon icon={faTwitter} />
              </Link>
              <Link href="#" color="inherit">
                <FontAwesomeIcon icon={faInstagram} />
              </Link>
            </Grid>
          </Grid>
          <Grid item s={12} sm={4}>
            <Typography variant="subtitle1" color="text.secondary" align="center">
              Made by Egor Chetverikov
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;
