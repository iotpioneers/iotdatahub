import React, { useState } from "react";
import { motion } from "framer-motion";
import { Tooltip } from "@material-tailwind/react";

type ModalProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const Modal: React.FC<ModalProps> = ({ open, setOpen }) => {
  const [message, setMessage] = useState("");
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(message);
    setMessage("");
    setOpen(false);
  };
  return (
    <div>
      <motion.div
        className="bg-white fixed right-4 bottom-2 z-20 flex flex-col rounded-2xl"
        initial={{ scale: 1, opacity: 0, height: 0, width: 0 }}
        animate={{
          x: open ? -30 : 0,
          y: open ? -30 : 0,
          width: open ? "300px" : 0,
          height: open ? "375px" : 0,
          opacity: 1,
        }}
        transition={{ type: "spring", duration: 2, ease: "easeInOut" }}
      >
        <motion.div
          className="pt-4 flex flex-col pl-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: "Tween", duration: 2 }}
        >
          <h5 className="cursor-pointer text-4xl text-blue-500 font-inter font-medium tracking-tight pt-4">
            Hello There 🖐🏻
          </h5>
          <span className="text-md text-blue-500 font-inter font-medium tracking-tight pt-4">
            Ask us anything about ARTISAN.
          </span>
          <div className="pt-8 mr-5">
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="message"
                className="w-full h-28 outline-none border-none text-black rounded-md"
                placeholder="Send us a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></input>
              <button className="h-full w-full py-2 mt-2 bg-n-9 rounded-md justify-center items-center text-center text-blue-500 hover:bg-n-5 hover:text-blue-50">
                Submit
              </button>
            </form>
          </div>
          <Tooltip
            content="Close"
            placement="left"
            interactive={false}
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            <div
              className="absolute top-4 right-4 text-white cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="#fff"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="#000"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </Tooltip>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Modal;
