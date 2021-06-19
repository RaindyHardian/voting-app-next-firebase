import Link from "next/link";
import firebaseApp from "../utils/firebaseConfig";
import { useRouter } from "next/router";
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
} from "@chakra-ui/core";

function AdminLayout({ children }) {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <div className="">
      <div className="dash__left">
        <div className="dash__leftH">
          ELECTION
          <div className="dash__open w-6 cursor-pointer" onClick={onOpen}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
        <div className="dash__linkContainer">
          <Link href="/admin">
            <div
              className={
                router.pathname == "/admin"
                  ? "dash__link dash__linkActive"
                  : "dash__link"
              }
            >
              <div className="w-4 mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
              </div>
              Dashboard
            </div>
          </Link>
          <Link href="/admin/election">
            <div
              className={
                router.pathname.includes("/election")
                  ? "dash__link dash__linkActive"
                  : "dash__link"
              }
            >
              <div className="w-4 mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                </svg>
              </div>
              Elections
            </div>
          </Link>
          <Link href="/admin/users">
            <div
              className={
                router.pathname.includes("/users")
                  ? "dash__link dash__linkActive"
                  : "dash__link"
              }
            >
              <div className="w-4 mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
              </div>
              Users
            </div>
          </Link>

          <div
            className="dash__link mt-4"
            onClick={() => firebaseApp.auth().signOut()}
          >
            <div className="w-4 mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            Logout
          </div>
        </div>
      </div>
      <div className="dash__right">{children}</div>

      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent className="drawer">
          <DrawerCloseButton className="text-white border-white" />
          <DrawerHeader>
            <div className="text-white pl-3">ELECTION</div>
          </DrawerHeader>
          <DrawerBody>
            <Link href="/admin">
              <div
                className={
                  router.pathname === "/admin"
                    ? "dash__link dash__linkActive pl-3 rounded"
                    : "dash__link pl-3"
                }
              >
                Dashboard
              </div>
            </Link>
            <Link href="/admin/election">
              <div
                className={
                  router.pathname.includes("/election")
                    ? "dash__link dash__linkActive pl-3"
                    : "dash__link pl-3"
                }
              >
                Elections
              </div>
            </Link>
            <Link href="/admin/users">
              <div
                className={
                  router.pathname.includes("/user")
                    ? "dash__link dash__linkActive pl-3"
                    : "dash__link pl-3"
                }
              >
                Users
              </div>
            </Link>
            <div
              className="dash__link pl-3"
              onClick={() => firebaseApp.auth().signOut()}
            >
              Logout
            </div>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
export default AdminLayout;
