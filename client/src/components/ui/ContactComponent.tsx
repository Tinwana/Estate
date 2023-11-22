import { useAppSelector } from "@/redux/hook";
import { getUserService } from "@/services/userServices/getUserService";
import Link from "next/link";
import { memo, useEffect, useState } from "react";

const Contact = ({ listing }: { listing: any }) => {
  const [landlord, setLandlord] = useState<any>(null);
  const [message, setMessage] = useState("");
  const user = useAppSelector((state) => state.user.currentUser);

  useEffect(() => {
    const getLandlord = async () => {
      try {
        const res = await getUserService(
          listing?.userRef,
          user?.id,
          user?.accessToken
        );
        setLandlord(res?.data);
      } catch (error) {
        console.log(error);
      }
    };
    getLandlord();
  }, [listing?.userRef]);
  return (
    <>
      {landlord && (
        <div className="flex flex-col gap-2 ">
          <p className="font-semibold">
            Contact <span>{landlord?.username}</span> for{" "}
            <span>{listing.name.toLowerCase()}</span>
          </p>
          <textarea
            className="rounded-lg w-full border p-3"
            placeholder="Enter your message here..."
            name="message"
            id="message"
            rows={2}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
            }}
          ></textarea>
          <Link
            className="bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:bg-slate-500"
            href={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
          >
            Send message
          </Link>
        </div>
      )}
    </>
  );
};

export default memo(Contact);
