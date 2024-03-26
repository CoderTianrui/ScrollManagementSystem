import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Input,
  Flex,
  Avatar,
  Select,
} from "@chakra-ui/react";
import { useState } from "react";
import api from "../api/axiosConfig";

function SignUp() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState("bear");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const clearInput = () => {
    setUsername("");
    setPassword("");
    setPhone("");
    setEmail("");
    setFirstName("");
    setLastName("");
    setAvatar("bear");
  };

  const sentSignUp = () => {
    api
      .post("/user/register", {
        username,
        password,
        avatar,
        email,
        firstName,
        lastName,
        phone,
      })
      .then((response) => {
        if (response.status === 200) {
          alert("Success");
          clearInput();
          onClose();
        }
      })
      .catch((error) => {
        if (error.response) {
          alert(error.response.data);
        } else {
          console.log("Register failed:", error);
        }
      });
  };

  return (
    <>
      <Button onClick={onOpen} colorScheme="blue" w="30%">
        Sign Up
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton onClick={clearInput} />
          <ModalBody>
            <Flex justifyContent="center" marginTop={2} marginBottom={4}>
              <Avatar size="2xl" src={`src/assets/Avatar/${avatar}.png`} />
            </Flex>
            <Flex justifyContent="center" marginTop={2} marginBottom={4}>
              <Select
                w="30%"
                onChange={(event) => setAvatar(event.target.value)}
              >
                <option value="bear">Bear</option>
                <option value="lion">Lion</option>
                <option value="panda">Panda</option>
                <option value="rabbit">Rabbit</option>
              </Select>
            </Flex>
            <Input
              marginBottom={4}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              onKeyDown={(event) => {
                if (!/[a-zA-Z0-9]/.test(event.key)) {
                  event.preventDefault();
                }
              }}
            />
            <Input
              marginBottom={4}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              onKeyDown={(event) => {
                if (!/[a-zA-Z0-9]/.test(event.key)) {
                  event.preventDefault();
                }
              }}
            />
            <Input
              marginBottom={4}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
            <Input
              marginBottom={4}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone Number [Optional]"
              onKeyDown={(event) => {
                if (
                  !/[0-9]/.test(event.key) &&
                  event.key !== "Tab" &&
                  event.key !== "Backspace"
                ) {
                  event.preventDefault();
                }
              }}
            />
            <Input
              marginBottom={4}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First Name"
            />
            <Input
              marginBottom={4}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last Name"
            />
            <Flex justifyContent="center" marginTop={4}>
              <Button colorScheme="blue" w="30%" onClick={sentSignUp}>
                Submit
              </Button>
            </Flex>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default SignUp;
