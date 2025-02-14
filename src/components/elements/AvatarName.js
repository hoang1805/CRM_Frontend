import React from "react";

const AvatarName = ({ name, avatar_url }) => {
  return (
    <div className="flex items-center space-x-3">
        <div className="avatar">
            <div className="size-6 rounded-full border">
            <img
                src={avatar_url || '/avatar-default.svg'}
                alt={name}
                className=""
            />
            </div>
        </div>
      
      <span className="ap-xdot">{name}</span>
    </div>
  );
};
export default AvatarName;
