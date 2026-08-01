"use client";

import React from "react";
import { FEATURED_PARTNERS } from "../constants";

export default function PartnerMarquee({ tasks = [] }) {
  const taskCompanies = tasks.map((t) => ({
    name: t.company_name,
    logo: t.company_logo || "",
    website: t.company_website || `https://www.google.com/search?q=${encodeURIComponent(t.company_name)}`,
    domain: t.domain,
  }));

  const allPartnersMap = new Map();
  [...FEATURED_PARTNERS, ...taskCompanies].forEach((item) => {
    if (item.name && !allPartnersMap.has(item.name.toLowerCase())) {
      allPartnersMap.set(item.name.toLowerCase(), {
        ...item,
        website: item.website || `https://www.google.com/search?q=${encodeURIComponent(item.name)}`,
      });
    }
  });

  const partnerList = Array.from(allPartnersMap.values());
  // Repeat list to create infinite smooth scrolling marquee
  const marqueeItems = [...partnerList, ...partnerList, ...partnerList];

  return (
    <div className="w-full mt-10 sm:mt-16 flex flex-col gap-6 relative z-10">
      <div className="flex flex-col items-center text-center gap-1">
        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
          PARTNER NETWORK
        </span>
        <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-wide uppercase">
          Participating Hiring Companies
        </h2>
      </div>

      <div className="relative w-full overflow-hidden py-4 bg-transparent">
        {/* Soft edge fade masks without solid dark backgrounds */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-black via-black/40 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-black via-black/40 to-transparent z-10 pointer-events-none" />

        <div className="flex items-center gap-12 sm:gap-16 animate-marquee w-max whitespace-nowrap">
          {marqueeItems.map((partner, index) => {
            const partnerUrl = partner.website || `https://www.google.com/search?q=${encodeURIComponent(partner.name)}`;

            return (
              <a
                key={`${partner.name}-${index}`}
                href={partnerUrl}
                target="_blank"
                rel="noopener noreferrer"
                title={`Visit ${partner.name} Website`}
                className="h-9 sm:h-11 flex items-center justify-center shrink-0 opacity-70 hover:opacity-100 hover:scale-110 transition-all duration-300 cursor-pointer group"
              >
                {partner.logo ? (
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="h-full w-auto object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                    onError={(e) => {
                      e.target.style.display = "none";
                      if (e.target.nextSibling) {
                        e.target.nextSibling.style.display = "inline";
                      }
                    }}
                  />
                ) : null}
                <span
                  className={`text-sm font-black text-slate-300 group-hover:text-white tracking-widest uppercase ${
                    partner.logo ? "hidden" : "inline"
                  }`}
                >
                  {partner.name}
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
