"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { DeviceData } from "@/types/device";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { Loader2, CheckCircle } from "lucide-react";

interface DeviceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (deviceData: Partial<DeviceData>) => Promise<void>;
  device?: DeviceData | null;
}

export function DeviceFormModal({
  isOpen,
  onClose,
  onSubmit,
  device,
}: DeviceFormModalProps) {
  const [formData, setFormData] = useState<Partial<DeviceData>>({
    name: "",
    status: "ONLINE",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitSuccess, setFormSubmitSuccess] = useState(false);

  useEffect(() => {
    if (device) {
      setFormData({
        name: device.name || "",
        status: device.status || "ONLINE",
        description: device.description || "",
      });
    } else {
      setFormData({
        name: "",
        status: "ONLINE",
        description: "",
      });
    }
    setFormSubmitSuccess(false);
  }, [device, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      setFormSubmitSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      setFormSubmitSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={device ? "Edit Device" : "Add New Device"}
      size="lg"
    >
      {formSubmitSuccess ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-10 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
            className="text-green-500 mb-4"
          >
            <CheckCircle size={80} />
          </motion.div>
          <h3 className="text-2xl font-bold mb-2">Success!</h3>
          <p className="text-gray-600 mb-6">
            {device
              ? "Device updated successfully"
              : "Device created successfully"}
          </p>
          <Button onClick={onClose}>Close</Button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Device Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter device name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Enter device description"
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="relative overflow-hidden"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    {device ? "Update Device" : "Add Device"}
                    <motion.div
                      className="absolute bottom-0 left-0 h-1 bg-white bg-opacity-30"
                      initial={{ width: 0 }}
                      animate={{
                        width: isSubmitting ? "100%" : "0%",
                      }}
                      transition={{ duration: 2 }}
                    />
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      )}
    </Modal>
  );
}
