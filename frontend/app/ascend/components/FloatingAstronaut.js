"use client";

import React from "react";

export default function FloatingAstronaut() {
  return (
    <div className="absolute top-1/4 -translate-y-1/2 -left-8 sm:-left-16 md:-left-28 lg:-left-40 xl:-left-48 z-0 pointer-events-none select-none animate-float-astronaut">
      <img
        src="/ascend/astronaut.png"
        alt="Ascend Ambient Background Astronaut"
        className="w-36 sm:w-56 md:w-72 lg:w-[380px] xl:w-[440px] h-auto object-contain opacity-35"
      />
    </div>
  );
}
