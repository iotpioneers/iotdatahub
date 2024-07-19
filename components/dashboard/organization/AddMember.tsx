"use client";

import * as React from "react";
import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Plus as PlusIcon } from "@phosphor-icons/react/dist/ssr/Plus";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import Input from "@mui/material/Input";
import Typography from "@mui/material/Typography";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "95%",
  maxHeight: "100%",
  maxWidth: 600,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  overflow: "auto",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  overflowY: "auto hidden",
};

const accessType = [
  { value: "VIEWER", label: "Viewer" },
  { value: "COMMENTER", label: "Commenter" },
  { value: "EDITOR", label: "Editor" },
];

const AddMember = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [access, setAccess] = useState("Viewer");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newMember = {
      id: `USR-${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0")}`,
      name,
      avatar: avatarPreview || "",
      email,
      phone,
      address: {
        city,
        country,
        state,
        street,
      },
      access,
    };
    console.log(newMember);
    handleClose();
  };

  return (
    <div>
      <Button
        startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />}
        variant="outlined"
        onClick={handleOpen}
      >
        Add Member
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add a New Member
          </Typography>
          <Box sx={formStyle}>
            <form noValidate onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    margin="normal"
                    select
                    label="Access"
                    value={access}
                    onChange={(e) => setAccess(e.target.value)}
                    required
                  >
                    {accessType.map((access) => (
                      <MenuItem key={access.value} value={access.value}>
                        {access.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1" gutterBottom>
                    Image
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <Avatar
                      src={avatarPreview || ""}
                      alt="Avatar Preview"
                      sx={{ width: 56, height: 56, marginRight: 2 }}
                    />
                    <Input
                      type="file"
                      onChange={handleAvatarChange}
                      inputProps={{ accept: "image/*" }}
                    />
                  </Box>
                </Grid>
              </Grid>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                style={{ marginTop: 20 }}
              >
                Add Member
              </Button>
            </form>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default AddMember;
