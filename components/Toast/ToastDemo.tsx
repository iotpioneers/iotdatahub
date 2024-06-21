import * as React from "react";
import * as Toast from "@radix-ui/react-toast";
import "./styles.css";

const ToastDemo = ({ title }: { title: string }) => {
  const [open, setOpen] = React.useState(false);
  const eventDateRef = React.useRef(new Date());
  const timerRef = React.useRef(0);

  React.useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  return (
    <div className="mt-5">
      <Toast.Provider swipeDirection="right">
        <button
          className="Button large violet"
          onClick={() => {
            setOpen(false);
            window.clearTimeout(timerRef.current);
            timerRef.current = window.setTimeout(() => {
              eventDateRef.current = oneWeekAway(new Date());
              setOpen(true);
            }, 100);
          }}
        >
          {title}
        </button>

        <Toast.Root className="ToastRoot" open={open} onOpenChange={setOpen}>
          <Toast.Title className="ToastTitle">Quick guides</Toast.Title>
          <Toast.Description asChild>
            {title}
            <time
              className="ToastDescription"
              dateTime={eventDateRef.current.toISOString()}
            >
              {prettyDate(eventDateRef.current)}
            </time>
          </Toast.Description>
          <Toast.Action
            className="ToastAction"
            asChild
            altText="Goto schedule to undo"
          >
            <button className="Button small green">Undo</button>
          </Toast.Action>
        </Toast.Root>
        <Toast.Viewport className="ToastViewport" />
      </Toast.Provider>
    </div>
  );
};

function oneWeekAway(date: Date) {
  const now = new Date();
  const inOneWeek = now.setDate(now.getDate());
  return new Date(inOneWeek);
}

function prettyDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(date);
}

export default ToastDemo;
