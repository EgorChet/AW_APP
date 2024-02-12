import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Typography, Card, Box, Avatar, IconButton, Grid } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRedoAlt } from "@fortawesome/free-solid-svg-icons";
import { faFacebookF, faInstagram, faLinkedinIn } from "@fortawesome/free-brands-svg-icons";
import WorldIndices from "./WorldIndices";
import CustomButton from "./CustomButton";

const ProfileDetails = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [avatar, setAvatar] = useState(`https://robohash.org/${user?.gender}?set=set5`);
  const [selectedQuote, setSelectedQuote] = useState({ quote: "", author: "" }); // Updated to store both
  // Define the array of quotes
  const quotes = [
    {
      author: "Warren Buffett",
      quote: "The stock market is designed to transfer money from the Active to the Patient.",
    },
    {
      author: "Benjamin Graham",
      quote:
        "The intelligent investor is a realist who sells to optimists and buys from pessimists.",
    },
    {
      author: "Peter Lynch",
      quote:
        "Go for a business that any idiot can run – because sooner or later, any idiot is probably going to run it.",
    },
    {
      author: "John Templeton",
      quote:
        "The time of maximum pessimism is the best time to buy, and the time of maximum optimism is the best time to sell.",
    },
    {
      author: "Charlie Munger",
      quote: "The big money is not in the buying or the selling, but in the waiting.",
    },
    {
      author: "Ray Dalio",
      quote: "The more you stress test it, the more you’ll be confident it’s strong.",
    },
    {
      author: "David Dreman",
      quote:
        "The stock market is filled with individuals who know the price of everything, but the value of nothing.",
    },
    {
      author: "George Soros",
      quote:
        "It’s not whether you’re right or wrong that’s important, but how much money you make when you’re right and how much you lose when you’re wrong.",
    },
    {
      author: "John Bogle",
      quote: "Don’t look for the needle in the haystack. Just buy the haystack!",
    },
    {
      author: "Howard Marks",
      quote: "Resisting – and thereby achieving success as a contrarian – isn’t easy.",
    },
    {
      author: "Jesse Livermore",
      quote:
        "The desire for constant action irrespective of underlying conditions is responsible for many losses in Wall Street.",
    },
    {
      author: "Paul Tudor Jones",
      quote: "Losers average losers.",
    },
    {
      author: "Philip Fisher",
      quote:
        "The stock market is filled with individuals who know the price of everything, but the value of nothing.",
    },
    {
      author: "Seth Klarman",
      quote: "Value investing is at its core the marriage of a contrarian streak and a calculator.",
    },
    {
      author: "William J. O'Neil",
      quote:
        "The whole secret to winning big in the stock market is not to be right all the time, but to lose the least amount possible when you’re wrong.",
    },
    {
      author: "Warren Buffett",
      quote: "Risk comes from not knowing what you’re doing.",
    },
    {
      author: "Peter Lynch",
      quote: "Know what you own, and know why you own it.",
    },
    {
      author: "Charlie Munger",
      quote: "Spend each day trying to be a little wiser than you were when you woke up.",
    },
    {
      author: "Ray Dalio",
      quote:
        "In order to be successful, you have to be able to first, be wrong, and to not have it be a problem to be wrong.",
    },
    {
      author: "David Dreman",
      quote:
        "The stock market is filled with individuals who know the price of everything, but the value of nothing.",
    },
    {
      author: "George Soros",
      quote:
        "It’s not whether you’re right or wrong that’s important, but how much money you make when you’re right and how much you lose when you’re wrong.",
    },
    {
      author: "John Bogle",
      quote: "Don’t look for the needle in the haystack. Just buy the haystack!",
    },
    {
      author: "Howard Marks",
      quote: "Resisting – and thereby achieving success as a contrarian – isn’t easy.",
    },
    {
      author: "Jesse Livermore",
      quote:
        "The desire for constant action irrespective of underlying conditions is responsible for many losses in Wall Street.",
    },
    {
      author: "Paul Tudor Jones",
      quote: "Losers average losers.",
    },
    {
      author: "Philip Fisher",
      quote:
        "The stock market is filled with individuals who know the price of everything, but the value of nothing.",
    },
    {
      author: "Seth Klarman",
      quote: "Value investing is at its core the marriage of a contrarian streak and a calculator.",
    },
    {
      author: "William J. O'Neil",
      quote:
        "The whole secret to winning big in the stock market is not to be right all the time, but to lose the least amount possible when you’re wrong.",
    },
  ];

  // Select a random quote when the component mounts
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setSelectedQuote(quotes[randomIndex]); // Update to set the entire quote object
  }, []);

  if (!user) {
    return (
      <Typography variant='h6' sx={{ mt: 2 }}>
        Loading user information...
      </Typography>
    );
  }

  const handleAvatarShuffle = () => {
    setAvatar(`https://robohash.org/$${Math.random()}?set=set5`);
  };

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={4}>
        <Card
          sx={{
            background: "linear-gradient(45deg, #FF8E53 30%, #123456 90%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: 3,
            borderRadius: 2,
            bgcolor: "background.paper",
            height: "100%",
          }}
        >
          <Box sx={{ p: 3, width: "100%", textAlign: "center" }}>
            <Box
              sx={{
                p: 3,
                width: "100%",
                textAlign: "center",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Avatar
                alt='User Avatar'
                src={avatar}
                sx={{ width: 200, height: 200, mb: 2, mr: 5 }}
              />
            </Box>

            <IconButton onClick={handleAvatarShuffle} sx={{ mb: 2 }}>
              <FontAwesomeIcon icon={faRedoAlt} size='m' />
            </IconButton>
            <Typography variant='h5' sx={{ color: "text.primary", mb: 1 }}>
              {`${user.name ?? ""} ${user.surname ?? ""}`}
            </Typography>
            <Typography variant='body1' sx={{ color: "text.secondary", mb: 1 }}>
              Age: {user.age}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-around", width: "60%", mb: 3 }}>
            <IconButton href={`https://www.facebook.com/${user.facebook}`} target='_blank'>
              <FontAwesomeIcon icon={faFacebookF} size='lg' />
            </IconButton>
            <IconButton href={`https://www.instagram.com/${user.instagram}`} target='_blank'>
              <FontAwesomeIcon icon={faInstagram} size='lg' />
            </IconButton>
            <IconButton href={`https://www.linkedin.com/in/${user.linkedin}`} target='_blank'>
              <FontAwesomeIcon icon={faLinkedinIn} size='lg' />
            </IconButton>
          </Box>
          <CustomButton variant='contained' color='primary' onClick={() => navigate("/profile")}>
            Update Profile
          </CustomButton>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card
          sx={{
            background: "linear-gradient(45deg, #123456 30%, #FF8E53 90%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: 3,
            borderRadius: 2,
            bgcolor: "background.paper",
            height: "100%",
          }}
        >
          <Box sx={{ p: 3, width: "70%" }}>
            <Typography
              variant='h5'
              gutterBottom
              component='div'
              sx={{ textAlign: "center", fontWeight: "bold" }}
            >
              Quote of the Day:
            </Typography>
            <Typography
              variant='body1'
              sx={{
                color: "text.secondary",
                mb: 1,
                fontSize: "2rem",
                fontStyle: "italic", // Makes the text italic
                fontWeight: "bold", // Makes the text bold
                fontFamily: "'Roboto Slab', serif", // Sets the font to Roboto Slab, fall back to serif
              }}
            >
              {selectedQuote.quote}
              <Typography variant='h6' sx={{ color: "text.secondary", mb: 1 }}>
                - {selectedQuote.author}
              </Typography>{" "}
              {/* Display the random quote */}
            </Typography>
          </Box>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card
          sx={{
            background: "linear-gradient(45deg, #FF8E53 30%, #123456 90%)",
            boxShadow: 3,
            borderRadius: 2,
            bgcolor: "background.paper",
            height: "100%",
          }}
        >
          <Typography
            variant='h5'
            gutterBottom
            component='div'
            sx={{ textAlign: "center", fontWeight: "bold", mt: 4 }}
          >
            World Indices:
          </Typography>
          <WorldIndices />
        </Card>
      </Grid>
    </Grid>
  );
};

export default ProfileDetails;

// import React from "react";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import {
//   Button,
//   Typography,
//   Grid,
//   Card,
//   CardContent,
//   Avatar,
//   Stack,
//   Link,
//   Box,
// } from "@mui/material";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faEnvelope, faUser, faBirthdayCake } from "@fortawesome/free-solid-svg-icons";
// import { faFacebookF, faInstagram, faLinkedinIn } from "@fortawesome/free-brands-svg-icons";
// import { faEdit } from "@fortawesome/free-solid-svg-icons";

// const ProfileDetails = () => {
//   const navigate = useNavigate();
//   const user = useSelector((state) => state.auth.user);

//   if (!user) {
//     return (
//       <Typography variant='h6' sx={{ mt: 2 }}>
//         Loading user information...
//       </Typography>
//     );
//   }

//   const getSocialMediaHref = (label, value) => {
//     switch (label) {
//       case "Facebook":
//         return `https://www.facebook.com/${value}`;
//       case "Instagram":
//         return `https://www.instagram.com/${value}`;
//       case "LinkedIn":
//         return `https://www.linkedin.com/in/${value}`;
//       default:
//         return value;
//     }
//   };

//   const userInfo = [
//     { label: "Email", value: user.email, Icon: faEnvelope, clickable: false },
//     { label: "Full Name", value: `${user.name} ${user.surname}`, Icon: faUser, clickable: false },
//     { label: "Age", value: user.age, Icon: faBirthdayCake, clickable: false },
//     { label: "Facebook", value: user.facebook, Icon: faFacebookF, clickable: true },
//     { label: "Instagram", value: user.instagram, Icon: faInstagram, clickable: true },
//     { label: "LinkedIn", value: user.linkedin, Icon: faLinkedinIn, clickable: true },
//   ].filter((info) => info.value);

//   return (
//     <Card
//       sx={{ my: 4, width: "100%", boxShadow: "0 8px 16px 0 rgba(0,0,0,0.2)", transition: "0.3s" }}
//     >
//       <CardContent>
//         <Typography variant='h4' gutterBottom component='div' sx={{ mb: 4, textAlign: "center" }}>
//           Profile Information
//         </Typography>
//         <Grid container spacing={2}>
//           {userInfo.map((info, index) => (
//             <Grid item xs={12} sm={6} md={4} key={index}>
//               <Stack direction='row' spacing={2} alignItems='center'>
//                 {info.clickable ? (
//                   <Link
//                     href={getSocialMediaHref(info.label, info.value)}
//                     target='_blank'
//                     rel='noopener noreferrer'
//                     sx={{
//                       display: "flex",
//                       alignItems: "center",
//                       textDecoration: "none",
//                       color: "inherit",
//                     }}
//                   >
//                     <Avatar sx={{ bgcolor: "primary.main" }}>
//                       <FontAwesomeIcon icon={info.Icon} style={{ color: "white" }} />
//                     </Avatar>
//                     <Typography variant='body1' sx={{ ml: 1 }}>
//                       <strong>{info.label}:</strong> {info.value}
//                     </Typography>
//                   </Link>
//                 ) : (
//                   <>
//                     <Avatar sx={{ bgcolor: "primary.main" }}>
//                       <FontAwesomeIcon icon={info.Icon} style={{ color: "white" }} />
//                     </Avatar>
//                     <Typography variant='body1'>
//                       <strong>{info.label}:</strong> {info.value}
//                     </Typography>
//                   </>
//                 )}
//               </Stack>
//             </Grid>
//           ))}
//         </Grid>
//         <Box display='flex' justifyContent='flex-end' mt={2}>
//           <Button
//             variant='contained'
//             color='primary'
//             size='small'
//             sx={{
//               boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
//               "&:hover": { boxShadow: "0 12px 16px 0 rgba(0,0,0,0.24)" },
//             }}
//             onClick={() => navigate("/profile")}
//             startIcon={<FontAwesomeIcon icon={faEdit} />}
//           >
//             Update Profile
//           </Button>
//         </Box>
//       </CardContent>
//     </Card>
//   );
// };

// export default ProfileDetails;
