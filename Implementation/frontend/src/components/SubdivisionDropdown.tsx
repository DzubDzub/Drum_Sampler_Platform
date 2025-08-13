import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "components/ui/dropdown-menu";
import useSubdivisionStore from "../stores/SubdivisionStore";

const subdivisions = [
  //{ label: "Eight Notes", value: "8n", img: "/images/eighth.png" },
  {
    label: "Sixteenth Notes",
    value: "16n",
    img: "/images/sixteenth.png",
  },
  {
    label: "Thirty-second Notes",
    value: "32n",
    img: "/images/thirtySecond.png",
  },
  /* {
    label: "Eighth Note Triplets",
    value: "8t",
    img: "/images/eighthTriplet.png",
  },
  {
    label: "Sixteenth Note Triplets",
    value: "16t",
    img: "/images/sixteenthTriplet.png",
  },*/
];

export default function SubdivisionDropdown() {
  const { selectedSubdivision, setSelectedSubdivision } = useSubdivisionStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 cursor-pointer border px-3 py-2 rounded">
        <img
          src={selectedSubdivision.img}
          alt={selectedSubdivision.label}
          style={{ width: 30, height: "auto" }}
        />
        <span>{selectedSubdivision.label}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {subdivisions.map((sub) => (
          <DropdownMenuItem
            key={sub.value}
            onSelect={() => setSelectedSubdivision(sub)}
            className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-100"
          >
            <img
              src={sub.img}
              alt={sub.label}
              style={{ width: 30, height: "auto" }}
            />
            {sub.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
