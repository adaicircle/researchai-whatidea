import React, { type Dispatch, type SetStateAction } from "react";

import { HiOutlineBuildingOffice2 } from "react-icons/hi2";

interface DocumentInputProps {
  fileUrl: string;
  setFileUrl: Dispatch<SetStateAction<string>>;
}

export const DocumentInput: React.FC<DocumentInputProps> = ({
  fileUrl,
  setFileUrl,
}) => {
  return (
    <div className="flex-grow">
      <div className="flex flex-col gap-1 rounded-s bg-[#F7F7F7]">
        <div className="flex items-center justify-center gap-0.5 shadow-sm">
          <div className="ml-2">
            <HiOutlineBuildingOffice2 size={20} />
          </div>
          <input
            placeholder="Enter the url of the file you want to download"
            className="align-center mt-[5px] w-full p-1.5 focus:outline-none "
            value={fileUrl}
            onChange={(evt) => setFileUrl(evt.target.value)}
            style={{ backgroundColor: "#F7F7F7" }}
          />
        </div>
      </div>
    </div>
  );
};
