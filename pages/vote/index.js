import { useState, useEffect } from "react";
import { ProtectUserRoute } from "../../context/auth";
import firebaseApp from "../../utils/firebaseConfig";
import { format } from "date-fns";
import firebase from "firebase";
import Layout from "../../components/Layout";
import { Spinner } from "@chakra-ui/core";

const vote = () => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let date = firebase.firestore.Timestamp.now();
    // let date = new Date();
    firebaseApp
      .firestore()
      .collection("elections")
      .where("active", "==", 1)
      .where("end", ">", date)
      .get()
      .then(items => {
        setElections(
          items.docs.map(item => {
            return {
              id: item.id,
              data: item.data()
            };
          })
        );
        setLoading(false);
      });
  }, []);
  const compareStart = e => {
    let s = new Date(e.target.attributes.tgl.value);
    let now = firebase.firestore.Timestamp.now().toDate();
    console.log(s);
    console.log(now);
    if (now <= s) {
      console.log("BELOM WAKTUNYA");
    } else {
      console.log("Sudah waktunya");
    }
  };
  return (
    <Layout>
      <div className="px-5">
        <div className="flex flex-row items-center justify-center text-2xl mt-3 mb-3 md:mb-6">
          <div className="mr-3">Choose Election</div>
          {loading ? <Spinner /> : null}
        </div>
        <div className="grid grid-cols-1 gap-y-5 md:grid-cols-3 md:gap-4 lg:gap-x-4 lg:gap-y-6 lg:grid-cols-4">
          {/* CARD */}
          {!loading
            ? elections.map(({ id, data }) => (
                <div key={id} className="rounded overflow-hidden shadow-lg">
                  <img
                    className="object-cover w-full "
                    src="/svg/Repeating-Triangles(1).svg"
                  />
                  <div className="px-6 py-4">
                    <div className="font-bold text-xl mb-1">{data.title}</div>
                    <div className="font-bold text-gray-800">Start </div>
                    <div className="text-gray-700 text-base mb-1">
                      {format(
                        data.start.toDate(),
                        "eeee, dd MMMM yyyy HH:mm:ss"
                      )}
                    </div>
                    <div className="font-bold text-gray-800">Until </div>
                    <div className="text-gray-700 text-base">
                      {format(data.end.toDate(), "eeee, dd MMMM yyyy HH:mm:ss")}
                    </div>
                    <div className="mt-6">
                      {(() => {
                        if (
                          firebase.firestore.Timestamp.now().toDate() <=
                          new Date(data.start.toDate())
                        ) {
                          return (
                            <button className="bg-orange-300 text-white tracking-wide py-2 px-6 rounded inline-block cursor-not-allowed">
                              Vote Later
                            </button>
                          );
                        } else {
                          return (
                            <button className="bg-orange-500 hover:bg-orange-600 text-white tracking-wide py-2 px-6 rounded inline-block">
                              Vote Now
                            </button>
                          );
                        }
                      })()}
                    </div>
                  </div>
                </div>
              ))
            : null}
        </div>
      </div>
    </Layout>
  );
};

export default ProtectUserRoute(vote);
