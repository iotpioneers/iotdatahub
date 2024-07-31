import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import Head from "next/head";

const VerifyEmail = () => {
  const router = useRouter();
  const { token } = router.query;
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setError("Invalid verification link.");
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await axios.get(`/api/email/verify?token=${token}`);
        console.log("Email verified:", response.data);
        setMessage(response.data.message);
      } catch (err) {
        setError("An error occurred while verifying your email.");
      }
    };

    verifyEmail();
  }, [token]);

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
