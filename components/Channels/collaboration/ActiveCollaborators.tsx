import { useOthers } from "@liveblocks/react/suspense";
import { Avatar } from "@mui/material";
import Image from "next/image";

const ActiveCollaborators = () => {
  const others = useOthers();

  const collaborators = others.map((other) => other.info);

  return (
    <ul className="collaborators-list">
      {collaborators.map(({ id, name, avatar, color }) => (
        <li key={id} className="grid justify-center items-center m-1">
          {avatar ? (
            <Image
              src={avatar || ""}
              alt={name}
              width={100}
              height={100}
              className="inline-block size-8 rounded-full ring-1 ring-slate-800"
              style={{ border: `2px solid ${color}` }}
            />
          ) : (
            <Avatar src="" alt={name}>
              {name[0].toUpperCase()}
            </Avatar>
          )}

          <p className="inline-block">{name.split(" ")[0]}</p>
        </li>
      ))}
    </ul>
  );
};

export default ActiveCollaborators;
