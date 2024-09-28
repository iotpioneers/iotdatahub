import React, { useState } from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
import CountryList from "./CountryList";
import {
  OutlinedInput,
  InputLabel,
  FormControl,
  FormHelperText,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import * as Yup from "yup";
import { useFormik } from "formik";

const schema = Yup.object().shape({
  country: Yup.string().required("Country is required"),
  phonenumber: Yup.number()
    .typeError("Must be a valid phone number")
    .required("Phone is required"),
});

interface CountryType {
  code: string;
  label: string;
  phone: string;
}

interface CountryPhoneModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: { country: string; phonenumber: string }) => void;
}

const CountryPhoneModal: React.FC<CountryPhoneModalProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const theme = useTheme();
  const [selectedCountry, setSelectedCountry] = useState<CountryType | null>(
    null
  );

  const formik = useFormik({
    initialValues: {
      country: "",
      phonenumber: "",
    },
    validationSchema: schema,
    onSubmit: (values) => {
      if (selectedCountry) {
        onSubmit({
          country: selectedCountry.label,
          phonenumber: `${selectedCountry.phone} ${values.phonenumber}`,
        });
      }
      onClose();
    },
  });

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" component="h2" gutterBottom>
          Complete Your Profile
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <FormControl
            fullWidth
            error={formik.touched.country && Boolean(formik.errors.country)}
            sx={{ mb: 2 }}
          >
            <CountryList
              selectedCountry={selectedCountry}
              setSelectedCountry={(country: CountryType | null) => {
                setSelectedCountry(country);
                formik.setFieldValue("country", country?.label || "");
              }}
            />
            {formik.touched.country && formik.errors.country && (
              <FormHelperText error>{formik.errors.country}</FormHelperText>
            )}
          </FormControl>
          {selectedCountry && (
            <FormControl
              fullWidth
              error={
                formik.touched.phonenumber && Boolean(formik.errors.phonenumber)
              }
              sx={{ mb: 2 }}
            >
              <InputLabel htmlFor="phonenumber">Phone Number</InputLabel>
              <OutlinedInput
                id="phonenumber"
                name="phonenumber"
                type="text"
                value={formik.values.phonenumber}
                onChange={formik.handleChange}
                startAdornment={`+${selectedCountry.phone} `}
                label="Phone Number"
              />
              {formik.touched.phonenumber && formik.errors.phonenumber && (
                <FormHelperText error>
                  {formik.errors.phonenumber}
                </FormHelperText>
              )}
            </FormControl>
          )}
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Submit
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default CountryPhoneModal;
