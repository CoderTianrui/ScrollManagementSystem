import { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import { useTokenContext } from "./TokenContext";

interface User {
  userId: number;
  userName: string;
  avatar: string;
  role: string;
  uploadScrollIds: number[];
  likesReceived: number;
  downloadScrollIds: number[];
  likeScrollIds: number[];
}

const useUser = () => {
  const [user, setUser] = useState<User>();
  const [error, setError] = useState<string>("");
  const { token, setToken } = useTokenContext();
  const [refreash, setRefreash] = useState<boolean>(false);

  useEffect(() => {
    if (token) {
      api
        .post("/user/profile", { token })
        .then((response) => {
          if (response.status === 200) {
            setUser(response.data);
          }
        })
        .catch((error) => {
          setError(error.response.data);
          setToken("");
        });
    }
  }, [refreash]);

  return { user, error, token, setRefreash, refreash };
};

export default useUser;
