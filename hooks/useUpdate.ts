import axios from "axios";
import useSWRMutation from "swr/mutation";

// Function to handle updating widget data (PUT)
const updateData = async (url: string, { arg }: { arg: any }) => {
  try {
    const response = await axios.put(url, arg);
    return response.data;
  } catch (error) {
    console.error("Error updating data:", error);
    throw new Error("Failed to update data");
  }
};

// Custom hook for updating data
const useUpdate = (path: string) => {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}${path}`;
  const { trigger, isMutating, data, error } = useSWRMutation(url, updateData);

  return {
    update: trigger,
    isUpdating: isMutating,
    data,
    error,
  };
};

export default useUpdate;
