"use client";

import React, { useState } from "react";
import { styled } from "@mui/system";
import { Modal as BaseModal } from "@mui/base/Modal";
import { Button } from "@mui/base/Button";
import { Channel } from "@/types";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";

interface NewFieldNestedModalProps {
  channel: Channel;
}

const NewFieldNestedModal = ({ channel }: NewFieldNestedModalProps) => {
  const [open, setOpen] = useState(false);
  const [fieldName, setFieldName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState<"success" | "error">(
    "success"
  );
  const [alertMessage, setAlertMessage] = useState("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSnackbarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const showAlert = (severity: "success" | "error", message: string) => {
    setAlertSeverity(severity);
    setAlertMessage(message);
    setSnackbarOpen(true);
  };

  const handleAddField = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/channels/${channel.id}/field`,
        {
          name: fieldName,
          channelId: channel.id,
          organizationId: channel.organizationId,
        }
      );

      if (response.status === 200) {
        showAlert("success", "Field added successfully!");
        handleClose();
        setFieldName("");
        setDescription("");
      } else {
        showAlert("error", "Failed to add field. Please try again.");
      }
    } catch (error) {
      showAlert(
        "error",
        "An error occurred while adding the field. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <TriggerButton onClick={handleOpen}>
        <svg
          className="w-16 h-16 text-primary-blue"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          ></path>
        </svg>
      </TriggerButton>
      <StyledModal
        open={open}
        onClose={handleClose}
        aria-labelledby="new-field-modal-title"
      >
        <ModalContent>
          <h2 id="new-field-modal-title" className="modal-title">
            Add New Channel Field
          </h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddField();
            }}
          >
            <FormField>
              <label htmlFor="fieldName">Field Name:</label>
              <input
                type="text"
                id="fieldName"
                value={fieldName}
                onChange={(e) => setFieldName(e.target.value)}
                required
              />
            </FormField>
            <FormField>
              <label htmlFor="description">Description:</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </FormField>
            <ButtonGroup>
              <ModalButton type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <CircularProgress
                      size={20}
                      color="inherit"
                      style={{ marginRight: "8px" }}
                    />
                    Adding Field...
                  </>
                ) : (
                  "Add Field"
                )}
              </ModalButton>
              <ModalButton onClick={handleClose} disabled={loading}>
                Cancel
              </ModalButton>
            </ButtonGroup>
          </form>
        </ModalContent>
      </StyledModal>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={alertSeverity}
          sx={{ width: "100%" }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

function ConfirmationModal({
  fieldName,
  fieldType,
  description,
}: {
  fieldName: string;
  fieldType: string;
  description: string;
}) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleConfirm = () => {
    handleClose();
  };

  return (
    <React.Fragment>
      <ModalButton onClick={handleOpen}>Create Field</ModalButton>
      <StyledModal
        open={open}
        onClose={handleClose}
        aria-labelledby="confirmation-modal-title"
      >
        <ModalContent style={{ width: "300px" }}>
          <h2 id="confirmation-modal-title" className="modal-title">
            Confirm New Field
          </h2>
          <p className="modal-description">
            Are you sure you want to create this new field?
          </p>
          <ConfirmationDetails>
            <strong>Name:</strong> {fieldName}
            <br />
            <strong>Type:</strong> {fieldType}
            <br />
            <strong>Description:</strong> {description}
          </ConfirmationDetails>
          <ButtonGroup>
            <ModalButton onClick={handleConfirm}>Confirm</ModalButton>
            <ModalButton onClick={handleClose}>Cancel</ModalButton>
          </ButtonGroup>
        </ModalContent>
      </StyledModal>
    </React.Fragment>
  );
}

const grey = {
  50: "#F3F6F9",
  100: "#E5EAF2",
  200: "#DAE2ED",
  300: "#C7D0DD",
  400: "#B0B8C4",
  500: "#9DA8B7",
  600: "#6B7A90",
  700: "#434D5B",
  800: "#303740",
  900: "#1C2025",
};

const blue = {
  200: "#99CCFF",
  300: "#66B2FF",
  400: "#3399FF",
  500: "#007FFF",
  600: "#0072E5",
  700: "#0066CC",
};

const StyledModal = styled(BaseModal)`
  position: fixed;
  z-index: 1300;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TriggerButton = styled(Button)`
  font-family: "IBM Plex Sans", sans-serif;
  font-weight: 600;
  font-size: 0.875rem;
  line-height: 1.5;
  padding: 8px 16px;
  border-radius: 8px;
  color: white;
  transition: all 150ms ease;
  cursor: pointer;
  background: ${({ theme }) =>
    theme.palette.mode === "dark" ? grey[900] : "#fff"};
  border: 1px solid
    ${({ theme }) => (theme.palette.mode === "dark" ? grey[700] : grey[200])};
  color: ${({ theme }) =>
    theme.palette.mode === "dark" ? grey[200] : grey[900]};
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);

  &:hover {
    background: ${({ theme }) =>
      theme.palette.mode === "dark" ? grey[800] : grey[50]};
    border-color: ${({ theme }) =>
      theme.palette.mode === "dark" ? grey[600] : grey[300]};
  }

  &:active {
    background: ${({ theme }) =>
      theme.palette.mode === "dark" ? grey[700] : grey[100]};
  }

  &:focus-visible {
    box-shadow: 0 0 0 4px
      ${({ theme }) => (theme.palette.mode === "dark" ? blue[300] : blue[200])};
    outline: none;
  }
`;

const ModalContent = styled("div")(
  ({ theme }) => `
  font-family: 'IBM Plex Sans', sans-serif;
  font-weight: 500;
  text-align: start;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow: hidden;
  background-color: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
  border-radius: 8px;
  border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
  box-shadow: 0 4px 12px ${
    theme.palette.mode === "dark" ? "rgb(0 0 0 / 0.5)" : "rgb(0 0 0 / 0.2)"
  };
  padding: 24px;
  width: 600px;
  height: 400px;
  color: ${theme.palette.mode === "dark" ? grey[50] : grey[900]};

  & .modal-title {
    margin: 0;
    line-height: 1.5rem;
    margin-bottom: 8px;
  }

  & .modal-description {
    margin: 0;
    line-height: 1.5rem;
    font-weight: 400;
    color: ${theme.palette.mode === "dark" ? grey[400] : grey[800]};
    margin-bottom: 4px;
  }
`
);

const FormField = styled("div")`
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;

  label {
    margin-bottom: 5px;
  }

  input,
  select,
  textarea {
    padding: 8px;
    border: 1px solid ${grey[300]};
    border-radius: 4px;
  }
`;

const ConfirmationDetails = styled("div")`
  margin-top: 10px;
  margin-bottom: 20px;
  padding: 10px;
  background-color: ${grey[100]};
  border-radius: 4px;
`;

const ButtonGroup = styled("div")`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const ModalButton = styled(Button)(
  ({ theme }) => `
  font-family: 'IBM Plex Sans', sans-serif;
  font-weight: 600;
  font-size: 0.875rem;
  line-height: 1.5;
  background-color: ${blue[500]};
  padding: 8px 16px;
  border-radius: 8px;
  color: white;
  transition: all 150ms ease;
  cursor: pointer;
  border: 1px solid ${blue[500]};
  box-shadow: 0 2px 1px ${
    theme.palette.mode === "dark"
      ? "rgba(0, 0, 0, 0.5)"
      : "rgba(45, 45, 60, 0.2)"
  }, inset 0 1.5px 1px ${blue[400]}, inset 0 -2px 1px ${blue[600]};

  &:hover {
    background-color: ${blue[600]};
  }

  &:active {
    background-color: ${blue[700]};
    box-shadow: none;
  }

  &:focus-visible {
    box-shadow: 0 0 0 4px ${
      theme.palette.mode === "dark" ? blue[300] : blue[200]
    };
    outline: none;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    box-shadow: none;
    &:hover {
      background-color: ${blue[500]};
    }
  }
`
);

export default NewFieldNestedModal;
