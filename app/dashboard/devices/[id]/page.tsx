import { Box, Flex, Grid } from "@radix-ui/themes";
import { notFound } from "next/navigation";
import React from "react";
import DeviceDetails from "../_components/DeviceDetails";
import { getServerSession } from "next-auth";
import authOptions from "@/app/api/auth/authOptions";
import DeleteButton from "@/components/DeleteButton";
import EditButton from "@/components/EditButton";

interface Props {
  params: { id: string };
}

const DeviceDetailsPage = async ({ params }: Props) => {
  const session = await getServerSession(authOptions);

  if (!params.id) notFound();

  return (
    <Grid columns={{ initial: "1", sm: "5" }} gap="5">
      <Box className="md:col-span-4">
        <DeviceDetails />
      </Box>
      {session && (
        <Box>
          <Flex direction="column" gap="4" mr="4">
            <EditButton />
            <DeleteButton />
          </Flex>
        </Box>
      )}
    </Grid>
  );
};

export default DeviceDetailsPage;
