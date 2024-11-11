import { Github, Instagram, Linkedin, Twitter } from "lucide-react";
import React from "react";

export default function Footer() {
  return (
    <footer className="w-full border-t py-6 mt-10 flex flex-col justify-center items-center gap-4">
      <a
        href="https://instagram.com/lvzck"
        target="_blank"
        rel="noreferrer"
        aria-label="Visit my Portfolio"
        className="group"
      >
        {"{/}"} with 🤍 by{" "}
        <span className="font-semibold transition-all ease-in-out group-hover:text-blue-500 decoration-wavy decoration-1 group-hover:underline underline-offset-[6px]">
        Kauã
        </span>
      </a>
    </footer>
  );
}
