import Link from "next/link";

export default function Sidebar() {
   return (
      <div className="w-52 min-h-screen bg-primary z-2">
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
