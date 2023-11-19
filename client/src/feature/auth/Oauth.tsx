import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/config/firebase";
import ButtonComponent from "@/components/ui/buttonComponent";
import { axiosRoot } from "@/lib/axios/axiosInstance";
import { useAppDispatch } from "@/redux/hook";
import { signInSuccess } from "@/redux/userSlice";
import { useRouter } from "next/navigation";

const Oauth = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const res = await axiosRoot({
        method: "POST",
        url: "auth/google",
        data: {
          id: result.user.uid,
        },
      });

      if (res.data?.status === "OK") {
        dispatch(
          signInSuccess({
            id: result.user.uid,
            username: result.user.displayName,
            email: result.user.email,
            avatar: result.user.photoURL,
            accessToken: res.data.access_token,
          })
        );
        router.push("/");
      }
    } catch (error) {
      console.log("sign in with google error", error);
    }
  };
  return (
    <ButtonComponent type="button" variant="scarlet" onClick={signInWithGoogle}>
      Continue with Google
    </ButtonComponent>
  );
};

export default Oauth;
