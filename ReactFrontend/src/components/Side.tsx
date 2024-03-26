import { Box, Button, Heading, Image, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Login from "./Login";
import api from "../api/axiosConfig";
import { useTokenContext } from "./TokenContext";
import ChangeProfile from "./ChangeProfile";

function Side() {
  const [avatar, setAvatar] = useState("guest");
  const [username, setUsername] = useState("Guest");
  const [role, setRole] = useState("guest");
  const [uploadScrolls, setUploadScrolls] = useState(0);
  const [likesReceived, setLikesReceived] = useState(0);
  const [isLogin, setIsLogin] = useState(false);
  const { token, setToken } = useTokenContext();

  const signOut = () => {
    setToken("");
    setAvatar("guest");
    setUsername("Guest");
    setRole("guest");
    setUploadScrolls(0);
    setLikesReceived(0);
    localStorage.removeItem("token");
    setIsLogin(false);
  };

  const roleColor = (role: string) => {
    if (role === "admin") {
      return "red";
    } else if (role === "user") {
      return "white";
    } else {
      return "gray";
    }
  };

  const varifyToken = () => {
    if (token) {
      api
        .post("/user/profile", { token })
        .then((response) => {
          if (response.status === 200) {
            setAvatar(response.data.avatar);
            setUsername(response.data.userName);
            setRole(response.data.role);
            setUploadScrolls(
              response.data.uploadScrollIds
                ? response.data.uploadScrollIds.length
                : 0
            );
            setLikesReceived(response.data.likesReceived);
            setIsLogin(true);
          }
        })
        .catch((error) => {
          if (error.response) {
            console.log(error.response.data);
            signOut();
          } else {
            console.log("Verify failed:", error);
            signOut();
          }
        });
    }
  };

  useEffect(() => {
    varifyToken();
  }, [token]);

  return (
    <>
      <VStack paddingTop={2} paddingBottom={2} h="85vh">
        <Box bg="#333" h="100%" padding={5}>
          <VStack>
            <Image src={`src/assets/Avatar/${avatar}.png`} alt="avatar" />
            <Heading as="h2" size="xl" color={roleColor(role)}>
              {username}
            </Heading>
            {isLogin && (
              <Heading as="h3" size="md" color="white">
                Upload Scrolls: {uploadScrolls}
              </Heading>
            )}
            {isLogin && (
              <Heading as="h3" size="md" color="white">
                Likes Received: {likesReceived}
              </Heading>
            )}
            {!isLogin && <Login />}
            {isLogin && <ChangeProfile />}
            {isLogin && (
              <Button
                colorScheme="red"
                w="50%"
                onClick={signOut}
                marginTop={40}
              >
                Sign Out
              </Button>
            )}
          </VStack>
        </Box>
      </VStack>
    </>
  );
}

export default Side;
