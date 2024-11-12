"use client";

import * as React from "react";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Unstable_Grid2";
import OutlinedInput from "@mui/material/OutlinedInput";
import { styled } from "@mui/system";
import { useSession } from "next-auth/react";

const FormGrid = styled(Grid)(() => ({
  display: "flex",
  flexDirection: "column",
}));

export default function AddressForm() {
  const { status, data: session } = useSession();

  return (
    <Grid container spacing={3}>
      <FormGrid xs={12} md={6}>
        <FormLabel htmlFor="first-name" required>
          First name
        </FormLabel>
        <OutlinedInput
          id="first-name"
          name="first-name"
          type="text"
          defaultValue={session?.user?.name.split(" ")[0]}
          placeholder="John"
          autoComplete="given-name"
          required
          size="small"
        />
      </FormGrid>
      <FormGrid xs={12} md={6}>
        <FormLabel htmlFor="last-name" required>
          Last name
        </FormLabel>
        <OutlinedInput
          id="last-name"
          name="last-name"
          type="text"
          defaultValue={session?.user?.name.split(" ")[1]}
          placeholder="Snow"
          autoComplete="family-name"
          required
          size="small"
        />
      </FormGrid>
      <FormGrid xs={12}>
        <FormLabel htmlFor="address" required>
          Country
        </FormLabel>
        <OutlinedInput
          id="address"
          name="address"
          type="text"
          defaultValue={session?.user?.country}
          placeholder="Country name"
          autoComplete="address-line"
          required
          size="small"
        />
      </FormGrid>
      <FormGrid xs={12}>
        <FormControlLabel
          control={<Checkbox name="saveAddress" value="yes" />}
          label="Use this address for payment details"
        />
      </FormGrid>
    </Grid>
  );
}
