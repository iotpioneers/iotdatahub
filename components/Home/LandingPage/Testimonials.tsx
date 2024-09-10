"use client";

import * as React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Slider from "react-slick";

// Import CSS files for react-slick
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const userTestimonials = [
  {
    avatar: <Avatar alt="Steven Maker" src="/static/images/avatar/1.jpg" />,
    name: "Steven Maker",
    occupation: "IoT Engineer",
    testimonial:
      "The IoT Data Hub has transformed our farming operations. The real-time data and insights have made it easier to manage our crops and maximize yield. The platform's user-friendly interface is a game changer for us.",
  },
  {
    avatar: <Avatar alt="Brice Dev" src="/static/images/avatar/2.jpg" />,
    name: "Brice Dev",
    occupation: "Software Engineer",
    testimonial:
      "The support team at IoT Data Hub is fantastic! Whenever we've had questions or needed help, they were quick to respond and provided the guidance we needed. It's reassuring to have such dedicated support.",
  },
  {
    avatar: <Avatar alt="Mahendra Florien" src="/static/images/avatar/3.jpg" />,
    name: "Mahendra Florien",
    occupation: "Software Engineer",
    testimonial:
      "IoT Data Hub's analytics and visualization tools have enabled us to conduct detailed research with ease. The platform's ability to process large amounts of data accurately has made it indispensable for our projects.",
  },
  {
    avatar: <Avatar alt="Saga Code" src="/static/images/avatar/4.jpg" />,
    name: "Saga Code",
    occupation: "Software Engineer",
    testimonial:
      "IoT Data Hub is a critical component of our agritech startup. The scalability and adaptability of the platform allow us to innovate and grow our business with confidence. We highly recommend it!",
  },
  {
    avatar: <Avatar alt="Wilson Super" src="/static/images/avatar/5.jpg" />,
    name: "Wilson Super",
    occupation: "IoT Engineer",
    testimonial:
      "I've tested several platforms, and IoT Data Hub stands out for its comprehensive features and reliability. It has everything we need to monitor, analyze, and optimize our farming processes.",
  },
  {
    avatar: (
      <Avatar alt="Emmanuel Engineer" src="/static/images/avatar/6.jpg" />
    ),
    name: "Emmanuel Engineer",
    occupation: "CDO, AgriTech Corp",
    testimonial:
      "The quality of IoT Data Hub exceeded our expectations. It's a well-designed, robust solution that supports our digital farming initiatives perfectly. It's definitely a valuable investment for any modern farm.",
  },
];

const Testimonials = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <Container
      id="testimonials"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: { xs: 3, sm: 6 },
      }}
    >
      <Box
        sx={{
          width: { sm: "100%", md: "60%" },
          textAlign: { sm: "left", md: "center" },
        }}
      >
        <Typography component="h2" variant="h4" color="text.primary">
          Testimonials
        </Typography>
        <Typography variant="body1" color="text.secondary">
          See what our customers love about our products. Discover how we excel
          in efficiency, durability, and satisfaction. Join us for quality,
          innovation, and reliable support.
        </Typography>
      </Box>
      <Box sx={{ width: "100%" }}>
        <Slider {...settings}>
          {userTestimonials.map((testimonial, index) => (
            <Box key={index} sx={{ p: 1 }}>
              <Card
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  height: "100%",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    pr: 2,
                  }}
                >
                  <CardHeader
                    avatar={testimonial.avatar}
                    title={testimonial.name}
                    subheader={testimonial.occupation}
                  />
                </Box>
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    {testimonial.testimonial}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Slider>
      </Box>
    </Container>
  );
};

export default Testimonials;
