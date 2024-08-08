"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Head from "next/head";

interface Props {
  params: { token: string };
}

const VerifyEmail = ({ params }: Props) => {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
    if (!params.token) {
      setError("Invalid verification link.");
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await axios.get(`/api/email/verify/${params.token}`);
        setMessage(response.data.message);
        router.push("/dashboard");
      } catch (err) {
        setError("An error occurred while verifying your email.");
      }
    };

    verifyEmail();
  }, [params.token]);

  return (
    <>
      <Head>
        <title>Email Verification - IoT Data Hub</title>
        <meta
          name="description"
          content="Verify your email address for IoT Data Hub to complete your registration."
        />
        <meta name="robots" content="noindex, nofollow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta charSet="UTF-8" />
      </Head>
      <div>
        <h1>Email Verification</h1>
        {message && <p>{message}</p>}
        {error && <p>{error}</p>}
      </div>
    </>
  );
};

export default VerifyEmail;
