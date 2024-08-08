import { Typography, Box } from "@mui/material";

const HeadingTexts = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) => {
  return (
    <Box mb="30px">
      <Typography
        variant="h2"
        color="GrayText"
        fontWeight="bold"
        sx={{ m: "0 0 5px 0" }}
      >
        {title}
      </Typography>
      <Typography variant="h5" color="greenyellow">
        {subtitle}
      </Typography>
    </Box>
  );
};

export default HeadingTexts;
