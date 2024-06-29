import { Menu, Popover, Transition } from "@headlessui/react";
import {
  Bars3CenterLeftIcon,
  BellIcon,
  CheckIcon,
  ChevronDownIcon,
  Cog8ToothIcon,
  CreditCardIcon,
  PencilIcon,
} from "@heroicons/react/24/solid";
import React, { Fragment } from "react";
import { Link } from "react-router-dom";

function Header({ setShowSideBar, showSideBar }) {
  return (
    <div
      className={`fixed w-full h-16 flex  items-center transition-all duration-[400ms] ${
        showSideBar ? "pl-[300px] bg-white" : "bg-white"
      }`}
    >
      <div className="lg:hidden pl-4 md:pl-16">
        <Bars3CenterLeftIcon
          className="h-8 w-8 text-gray-700 cursor-pointer"
          onClick={() => setShowSideBar(!showSideBar)}
        />
      </div>

    </div>
  );
}

export default Header;
