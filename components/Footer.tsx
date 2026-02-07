"use client";

import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-(--color-blak) mt-24 text-white px-6 py-10">
      <div className="max-w-330 mx-auto grid md:grid-cols-3 gap-8">
        {/* Brand / About */}
        <div>
          <h4 className="font-heading text-xl text-(--color-base) mb-4">
            Rayyan Aid
          </h4>
          <p className="font-body text-(--color-gray) leading-7">
            Making an impact, one donation at a time. Your support drives
            meaningful change and helps communities thrive.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-heading text-xl text-[var(--color-base)] mb-4">
            Quick Links
          </h4>
          <ul className="space-y-2">
            {[
              { name: "Dashboard", href: "/dashboard" },
              { name: "Projects", href: "/projects" },
              { name: "Donations", href: "/donations" },
              { name: "Profile", href: "/profile" },
            ].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="hover:text-[var(--color-base)] transition-colors duration-300"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact / Social */}
        <div>
          <h4 className="font-heading text-xl text-[var(--color-base)] mb-4">
            Contact
          </h4>
          <ul className="space-y-2 font-body text-[var(--color-gray)]">
            <li>
              Email:{" "}
              <Link
                href="mailto:info@rayyanaid.org"
                className="hover:text-[var(--color-base)] transition-colors duration-300"
              >
                info@rayyanaid.org
              </Link>
            </li>
            <li>
              Phone:{" "}
              <Link
                href="tel:07063653772"
                className="hover:text-[var(--color-base)] transition-colors duration-300"
              >
                07063653772
              </Link>
            </li>
            <li>Address: 123 Charity Lane, Lagos, Nigeria</li>
          </ul>
          <div className="flex mt-4 space-x-4">
            {[
              { href: "https://twitter.com/rayyanaid", icon: "fab fa-twitter" },
              { href: "https://facebook.com/rayyanaid", icon: "fab fa-facebook" },
              { href: "https://instagram.com/rayyanaid", icon: "fab fa-instagram" },
            ].map((social) => (
              <Link
                key={social.href}
                href={social.href}
                target="_blank"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-[var(--color-white)]/10 text-[var(--color-white)] hover:bg-[var(--color-base)] transition-all duration-300"
              >
                <i className={social.icon}></i>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10 border-t border-[var(--color-white)]/20 pt-6 text-center font-body text-[var(--color-gray)] text-sm">
        &copy; {new Date().getFullYear()} Rayyan Aid. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
