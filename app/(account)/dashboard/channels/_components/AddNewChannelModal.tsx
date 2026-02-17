"use client";
import { useEffect } from "react";
import {
  ArchiveBoxXMarkIcon,
  CloudArrowUpIcon,
} from "@heroicons/react/20/solid";
import { Formik, Form, FieldArray } from "formik";
import * as Yup from "yup";
import { useSWRConfig } from "swr";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useGlobalState } from "@/context/globalContext";
import { createChannelRoom } from "@/lib/actions/room.actions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast-provider";

// Constants
const hardwareOptions = [
  "ESP32",
  "ESP8266",
  "Arduino",
  "Raspberry Pi",
  "Other",
];

const connectionOptions = ["WiFi", "Ethernet", "Satellite", "GSM"];

// Validation Schema
const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  description: Yup.string().optional(),
  connectionType: Yup.string().required("Connection type is required"),
  hardware: Yup.string().required("Hardware is required"),
});

const fetcher = (url: string, data: any) =>
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((res) => res.json());

export default function AddNewChannelModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { status, data: session } = useSession();
  const { state, fetchCurrentOrganization } = useGlobalState();
  const router = useRouter();
  const toast = useToast();

  const { mutate } = useSWRConfig();

  const currentOrganization = state.currentOrganization;
  const { id: userId, email } = session!.user;

  useEffect(() => {
    if (status !== "loading" && status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    fetchCurrentOrganization();
  }, [currentOrganization]);

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      const result = await mutate(
        "/api/channels",
        fetcher("/api/channels", {
          ...values,
          organizationId: currentOrganization!.id,
        }),
        { revalidate: true },
      );

      if (!result || "error" in result) {
        toast.toast({
          type: "error",
          message: result?.error || "Failed to create channel",
        });
        setSubmitting(false);
        return;
      }

      const { id: roomId, name: title } = result.newChannel;

      const room = await createChannelRoom({
        roomId,
        userId,
        email,
        title,
      });

      if ("error" in room) {
        toast.toast({
          type: "error",
          message: room.error,
        });
        setSubmitting(false);
        return;
      }

      toast.toast({
        type: "success",
        message: "Channel created successfully, redirecting to devices ...",
      });

      router.push(`/dashboard/devices`);
    } catch (error) {
      toast.toast({
        type: "error",
        message: "An unexpected error occurred.",
      });
      onClose();
    } finally {
      setSubmitting(false);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle>Create New Channel</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Formik
            initialValues={{
              name: "",
              description: "",
              fields: [""],
              connectionType: "WiFi",
              hardware: "ESP8266",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({
              values,
              errors,
              touched,
              isSubmitting,
              handleBlur,
              handleChange,
              setFieldValue,
            }) => (
              <Form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Channel Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    maxLength={50}
                    className={
                      errors.name && touched.name ? "border-red-500" : ""
                    }
                  />
                  {touched.name && errors.name && (
                    <p className="text-sm text-red-500">{errors.name}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hardware">Hardware</Label>
                    <Select
                      value={values.hardware}
                      onValueChange={(value) =>
                        setFieldValue("hardware", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white shadow shadow-black">
                        {hardwareOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="connectionType">Connection Type</Label>
                    <Select
                      value={values.connectionType}
                      onValueChange={(value) =>
                        setFieldValue("connectionType", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white shadow shadow-black">
                        {connectionOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={values.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    rows={4}
                    maxLength={128}
                    placeholder="Enter channel description..."
                  />
                  <p className="text-sm text-gray-500">
                    {values.description?.length || 0} / 128
                  </p>
                </div>

                <div className="flex justify-between pt-4">
                  <Button type="button" variant="outline" onClick={onClose}>
                    Cancel
                  </Button>

                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && (
                      <CloudArrowUpIcon className="w-4 h-4 mr-2" />
                    )}
                    {isSubmitting ? "Creating..." : "Add Channel"}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </DialogContent>
    </Dialog>
  );
}
