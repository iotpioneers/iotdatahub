import axios from "axios";
import useSWRMutation from "swr/mutation";

// Function to handle delete widget data (DELETE)
const deleteData = async (url: string) => {
  try {
    const response = await axios.delete(url);
    return response.data;
  } catch (error) {
    throw new Error("Failed to delete data)");
  }
};

// Custom hook for deleting data
const useDelete = (path: string) => {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}${path}`;
  const { trigger, isMutating, data, error } = useSWRMutation(url, deleteData);

  return {
    delete: trigger,
    isDeleting: isMutating,
    data,
    error,
  };
};

export default useDelete;
