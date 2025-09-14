import axios from "axios";
import useSWR from "swr";

// Function to fetch data using

const fetchData = async (url: string) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch data");
  }
};

const useFetch = (path: string) => {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}${path}`;
  const { data, error, isLoading } = useSWR(url, fetchData);

  return { data, error, isLoading, refetch: () => fetchData(url) };
};

export default useFetch;
