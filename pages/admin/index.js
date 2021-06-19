import AdminLayout from "../../components/AdminLayout";
import { ProtectRoute } from "../../context/auth";
import Head from "next/head";

function Admin() {
  return (
    <AdminLayout>
      <Head>
        <title>Admin Dashboard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="">
        <div className="px-3 md:px-0 text-2xl text-gray-800 md:text-3xl font-bold mb-3">
          Dashboard
        </div>
        <div className="bg-white px-3 py-2 md:py-6 md:px-10 rounded overflow-x-auto mb-4 md:shadow-lg ">
          <div className="font-bold text-gray-800 text-xl mb-2">
            Welcome to your dashboard!
          </div>
          <div className="text-gray-700 text-lg">
            This dashboard is used to manage and control the entire application.
            You can check all of the page using the navigation bar. This page
            contains general information about the application. Elections page
            contains all of the election data that you can manage, view, or
            edit. Users page contains all of the user data that registered to
            this app.
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
export default ProtectRoute(Admin);

// export async function getStaticProps() {
//   const elections = await firebaseAppp
//     .firestore()
//     .collection("elections")
//     .get();
//   const data = elections.docs.map(item => {
//     return {
//       id: item.id,
//       election: item.data()
//     };
//   });
//   return {
//     props: {
//       elections: data
//     }
//   };
// }
