"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardActionArea,
  CardContent,
} from "@mui/material";
import {
  AppsOutlined,
  KeyboardOutlined,
  QrCodeScannerOutlined,
} from "@mui/icons-material";
import { PointerIcon } from "lucide-react";
import FromChannelModal from "./modals/FromChannelModal";
import ScanQRModal from "./modals/ScanQRModal";
import ManualEntryModal from "./modals/ManualEntryModal";

const NewDeviceModal = () => {
  const [openModal, setOpenModal] = useState(false);
  const [openFromChannelModal, setOpenFromChannelModal] = useState(false);
  const [openScanQRModal, setOpenScanQRModal] = useState(false);
  const [openManualEntryModal, setOpenManualEntryModal] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const [modalFooterContent, setModalFooterContent] = useState(
    <Box display="flex" alignItems="center" gap={1}>
      <PointerIcon />
      <Typography variant="body1">
        Point on the cards to see instructions
      </Typography>
    </Box>,
  );

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => {
    setOpenModal(false);
    setOpenFromChannelModal(false);
    setOpenScanQRModal(false);
    setOpenManualEntryModal(false);
  };

  const handleCardHover = (cardType: string | null) => {
    setHoveredCard(cardType);
    updateModalFooterContent(cardType);
  };

  const handleCardLeave = () => {
    setHoveredCard(null);
    setModalFooterContent(
      <Box display="flex" alignItems="center" gap={1}>
        <PointerIcon />
        <Typography variant="body1">
          Point on the cards to see instructions
        </Typography>
      </Box>,
    );
  };

  const updateModalFooterContent = (cardType: string | null) => {
    switch (cardType) {
      case "from-channel":
        setModalFooterContent(
          <Box display="flex" alignItems="center" gap={1}>
            <AppsOutlined />
            <Typography variant="body1">
              Create a new device from an existing channel
            </Typography>
          </Box>,
        );
        break;
      case "scan-qr":
        setModalFooterContent(
          <Box display="flex" alignItems="center" gap={1}>
            <QrCodeScannerOutlined />
            <Typography variant="body1">
              Scan the QR code on your device using the camera
            </Typography>
          </Box>,
        );
        break;
      case "manual-entry":
        setModalFooterContent(
          <Box display="flex" alignItems="center" gap={1}>
            <KeyboardOutlined />
            <Typography variant="body1">
              Enter the code provided with the device (it's usually placed below
              QR code)
            </Typography>
          </Box>,
        );
        break;
      default:
        setModalFooterContent(
          <Box display="flex" alignItems="center" gap={1}>
            <PointerIcon />
            <Typography variant="body1">
              Point on the cards to see instructions
            </Typography>
          </Box>,
        );
    }
  };

  return (
    <>
      {/* New Device Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpenModal}
        className="bg-orange-50 px-3 rounded-md text-white"
      >
        New Device
      </Button>

      {/* New Device Modal */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            padding: 4,
            "@media (max-width: 600px)": {
              padding: 2,
            },
            "@media (min-width: 1200px)": {
              maxWidth: "800px",
            },
          },
        }}
      >
        <DialogTitle>
          <Typography variant="h1" fontWeight="bold">
            New Device
          </Typography>
          <Typography variant="h6" mt={1}>
            Choose a way to create a new device
          </Typography>
        </DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            justifyContent: "space-around",
            gap: 4,
            p: 4,
          }}
        >
          {/* From Channel */}
          <Card
            sx={{
              textAlign: "center",
              width: 200,
              backgroundColor:
                hoveredCard === "from-channel" ? "primary.main" : "inherit",
              color: hoveredCard === "from-channel" ? "white" : "primary.main",
            }}
            onMouseEnter={() => handleCardHover("from-channel")}
            onMouseLeave={handleCardLeave}
            onClick={() => setOpenFromChannelModal(true)}
          >
            <CardActionArea
              sx={{
                padding: "20px 0",
              }}
            >
              <CardContent>
                <AppsOutlined
                  sx={{
                    fontSize: hoveredCard === "from-channel" ? 72 : 48,
                  }}
                />
                <Typography variant="h5" mt={2}>
                  From Channel
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>

          {/* Scan QR Code */}
          <Card
            sx={{
              textAlign: "center",
              width: 200,
              backgroundColor:
                hoveredCard === "scan-qr" ? "primary.main" : "inherit",
              color: hoveredCard === "scan-qr" ? "white" : "primary.main",
            }}
            onMouseEnter={() => handleCardHover("scan-qr")}
            onMouseLeave={handleCardLeave}
          >
            <CardActionArea
              sx={{
                padding: "20px 0",
              }}
            >
              <CardContent>
                <QrCodeScannerOutlined
                  sx={{
                    fontSize: hoveredCard === "scan-qr" ? 72 : 48,
                  }}
                />
                <Typography variant="h5" mt={2}>
                  Scan QR code
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>

          {/* Manual Entry */}
          <Card
            sx={{
              textAlign: "center",
              width: 200,
              backgroundColor:
                hoveredCard === "manual-entry" ? "primary.main" : "inherit",
              color: hoveredCard === "manual-entry" ? "white" : "primary.main",
            }}
            onMouseEnter={() => handleCardHover("manual-entry")}
            onMouseLeave={handleCardLeave}
          >
            <CardActionArea
              sx={{
                padding: "20px 0",
              }}
            >
              <CardContent>
                <KeyboardOutlined
                  sx={{
                    fontSize: hoveredCard === "manual-entry" ? 72 : 48,
                  }}
                />
                <Typography variant="h5" mt={2}>
                  Manual entry
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </DialogContent>
        <DialogActions
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 24px",
            "@media (max-width: 600px)": {
              padding: "12px 16px",
            },
          }}
        >
          {modalFooterContent}
          <Button onClick={handleCloseModal} color="secondary">
            Cancel
          </Button>
        </DialogActions>
        {/* Open other modals based on card selection */}
        {openFromChannelModal && (
          <FromChannelModal
            open={openFromChannelModal}
            onClose={() => setOpenFromChannelModal(false)}
          />
        )}
        {openScanQRModal && (
          <ScanQRModal
            open={openScanQRModal}
            onClose={() => setOpenScanQRModal(false)}
          />
        )}
        {openManualEntryModal && (
          <ManualEntryModal
            open={openManualEntryModal}
            onClose={() => setOpenManualEntryModal(false)}
          />
        )}
      </Dialog>
    </>
  );
};

export default NewDeviceModal;
