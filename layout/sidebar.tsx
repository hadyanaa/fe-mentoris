"use client"
import Link from "next/link";

const Sidebar = () => {
   return (
      <div className="fixed top-0 left-0 w-28 xl:w-52 min-h-screen bg-primary">
         <ul className="flex flex-col gap-8">
            <li className="border border-white">
               <Link href="/">
                  LOGO BKPK
               </Link>
            </li>
            <li className="border border-white">
               <Link href="/dashboard">
                  Dashboard
               </Link>
            </li>
         </ul>
      </div>
   );
}

export default Sidebar;