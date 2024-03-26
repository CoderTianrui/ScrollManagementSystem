import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Input,
  Flex,
} from "@chakra-ui/react";
import { useState } from "react";
import api from "../api/axiosConfig";
import SignUp from "./SignUp";
import { useTokenContext } from "./TokenContext";

function Login() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setToken } = useTokenContext();

  const sentLogin = () => {
    api
      .post("/user/login", { username, password })
      .then((response) => {
        if (response.status === 200) {
          localStorage.setItem("token", response.data);
          setToken(localStorage.getItem("token"));
          setPassword("");
          onClose();
        }
      })
      .catch((error) => {
        if (error.response) {
          alert(error.response.data);
        } else {
          console.log("Login failed:", error);
        }
      });
  };

  return (
    <>
      <Button onClick={onOpen} w="50%" colorScheme="messenger">
        Log in
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Log in</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              marginBottom={4}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
            />
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
            <Flex justifyContent="center" marginTop={4}>
              <Button
                colorScheme="blue"
                w="30%"
                marginRight={10}
                onClick={sentLogin}
              >
                Log in
              </Button>
              <SignUp />
            </Flex>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default Login;
