import { useState } from "react";
import { Spinner } from "@chakra-ui/core";
import firebaseApp from "../../../utils/firebaseConfig";
import firebase from "firebase";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import AdminLayout from "../../../components/AdminLayout";
import { ProtectRoute } from "../../../context/auth";

const create = (props) => {
  const router = useRouter();
  const [key, setKey] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [year, setYear] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [active, setActive] = useState("0");

  const [loading, setLoading] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");

  const submit = e => {
    e.preventDefault();
    if (
      key &&
      title &&
      description &&
      year &&
      startDate &&
      startTime &&
      endDate &&
      endTime &&
      active
    ) {
      setLoading(true);
      firebaseApp
        .firestore()
        .collection("elections")
        .doc(key)
        .set({
          title: title,
          description: description,
          year: year,
          start: firebase.firestore.Timestamp.fromDate(
            new Date(startDate + " " + startTime)
          ),
          end: firebase.firestore.Timestamp.fromDate(
            new Date(endDate + " " + endTime)
          ),
          active: active
        })
        .then(() => {
          setLoading(false);
          setAlertMsg("");
          return router.push("/admin/election");
        })
        .catch(err => {
          console.log(err);
          setLoading(false);
        });
    } else {
      setAlertMsg("*Please all the input below");
    }
  };
  return (
    <AdminLayout>
      <Head>
        <title>Create Election</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="overflow-x-auto mb-6 ">
        {/* NAV BUTTON CONTAINER */}
        <div className="flex flex-row justify-between mb-3 px-3 md:px-0">
          {/* BACK BUTTON */}
          <div className="w-8 md:w-10 text-gray-700 hover:text-gray-900 inline-block">
            <Link href="/admin/election">
              <svg
                className="cursor-pointer"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L9.414 11H13a1 1 0 100-2H9.414l1.293-1.293z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>
        </div>

        <div className="bg-white px-3 py-2 md:py-6 md:px-10 rounded overflow-x-auto mb-6 md:shadow-lg">
          <div className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-5">
            Create New Election
          </div>
          <div className="text-red-600 italic mb-3">{alertMsg}</div>
          <form className="w-full" onSubmit={submit}>
            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/6">
                <label className="block text-gray-500 font-bold md:text-center mb-1 md:mb-0 pr-4">
                  Key
                </label>
              </div>
              <div className="md:w-5/6">
                <input
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  type="text"
                  placeholder="ex: e2017, e2018, etc"
                  value={key}
                  onChange={e => setKey(e.target.value)}
                />
              </div>
            </div>
            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/6">
                <label className="block text-gray-500 font-bold md:text-center mb-1 md:mb-0 pr-4">
                  Title
                </label>
              </div>
              <div className="md:w-5/6">
                <input
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                />
              </div>
            </div>
            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/6">
                <label className="block text-gray-500 font-bold md:text-center mb-1 md:mb-0 pr-4">
                  Description
                </label>
              </div>
              <div className="md:w-5/6">
                <input
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  type="text"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />
              </div>
            </div>
            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/6">
                <label className="block text-gray-500 font-bold md:text-center mb-1 md:mb-0 pr-4">
                  Year
                </label>
              </div>
              <div className="md:w-5/6">
                <input
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  type="text"
                  value={year}
                  onChange={e => setYear(e.target.value)}
                />
              </div>
            </div>
            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/6">
                <label className="block text-gray-500 font-bold md:text-center mb-1 md:mb-0 pr-4">
                  Start
                </label>
              </div>
              <div className="md:w-3/6">
                <input
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                />
              </div>
              <div className="md:w-2/6">
                <input
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  type="time"
                  value={startTime}
                  onChange={e => setStartTime(e.target.value)}
                />
              </div>
            </div>
            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/6">
                <label className="block text-gray-500 font-bold md:text-center mb-1 md:mb-0 pr-4">
                  End
                </label>
              </div>
              <div className="md:w-3/6">
                <input
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                />
              </div>
              <div className="md:w-2/6">
                <input
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  type="time"
                  value={endTime}
                  onChange={e => setEndTime(e.target.value)}
                />
              </div>
            </div>
            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/6">
                <label className="block text-gray-500 font-bold md:text-center mb-1 md:mb-0 pr-4">
                  Active
                </label>
              </div>
              <div className="md:w-5/6">
                <select
                  className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="grid-state"
                  value={active}
                  onChange={e => setActive(e.target.value)}
                >
                  <option value="1">Active</option>
                  <option value="0">Inactive</option>
                </select>
              </div>
            </div>
            <div className="md:flex md:justify-center md:items-center">
              {/* <div className="md:w-2/6"></div> */}
              <div className="flex flex-row items-center">
                <button
                  className="shadow bg-purple-600 hover:bg-purple-700 focus:shadow-outline focus:outline-none text-white tracking-wide py-2 px-6 rounded inline-block mr-3"
                  type="submit"
                >
                  Submit
                </button>
                {loading ? <Spinner /> : null}
              </div>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ProtectRoute(create);
