import React from "react";
import { notificationImages } from "@/constants";

type NotificationProps = {
  className?: string;
  title: string;
};

const Notification = ({ className, title }: NotificationProps) => {
  return (
    <div
      className={`${
        className || ""
      } flex items-center p-4 pr-6 bg-n-9/40 backdrop-blur border border-n-1/10 rounded-2xl gap-5`}
    >
      <img
        src="notification/image-1.jpeg"
        width={62}
        height={62}
        alt="image"
        className="rounded-xl"
      />

      <div className="flex-1">
        <h6 className="mb-1 font-semibold text-base">{title}</h6>

        <div className="flex items-center justify-between">
          <ul className="flex -m-0.5">
            {notificationImages.map((item, index) => (
              <li
                key={index}
                className="flex w-6 h-6 border-2 border-n-12 rounded-full overflow-hidden"
              >
                <img
                  src={item}
                  className="w-full"
                  width={20}
                  height={20}
                  alt={item}
                />
              </li>
            ))}
          </ul>
          <div className="body-2 text-n-13">
            <div className="flex gap-3 text-lime-600">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-50"></span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;
