import Head from "next/head";
import Link from "next/link";

function Layout({ children, props }) {
  return (
    <div>
      <div className="border-b-2 border-gray-300">
        <div className="px-5 md:px-10 py-3 flex flex-cols justify-between items-center">
          <Link href="/">
            <div className="font-bold text-gray-800 cursor-pointer">
              ELECTION
            </div>
          </Link>
        </div>
      </div>
      {children}
    </div>
  );
}
export default Layout;
