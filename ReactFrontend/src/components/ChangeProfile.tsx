import {
  Avatar,
  Button,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Select,
} from "@chakra-ui/react";
import api from "../api/axiosConfig";
import { useEffect, useState } from "react";
import { useTokenContext } from "./TokenContext";

function ChangeProfile() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { token, setToken } = useTokenContext();
  const [avatar, setAvatar] = useState("guest");
  const [username, setUsername] = useState("Guest");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const getUser = () => {
    if (token) {
      api
        .post("/user/profile", { token })
        .then((response) => {
          if (response.status === 200) {
            setAvatar(response.data.avatar);
            setUsername(response.data.userName);
            setEmail(response.data.email);
            setPhone(response.data.phone || "");
            setFirstName(response.data.firstName);
            setLastName(response.data.lastName);
          }
        })
        .catch((error) => {
          if (error.response) {
            console.log(error.response.data);
          } else {
            console.log("Verify failed:", error);
          }
        });
    }
  };

  const sentChangeProfile = () => {
    api
      .post("/user/changeProfile", {
        token,
        avatar,
        email,
        phone,
        firstName,
        lastName,
        currentPassword,
        newPassword,
      })
      .then((response) => {
        if (response.status === 200) {
          window.location.reload();
        }
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.data == "Token invalid") {
            alert("Token invalid, please login again");
            setToken("");
          }
          alert(error.response.data);
        } else {
          console.log("Change profile failed:", error);
        }
      });
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <>
      <Button onClick={onOpen} colorScheme="purple" w="50%" marginTop={10}>
        Change Profile
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{username}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex justifyContent="center" marginTop={2} marginBottom={4}>
              <Avatar size="2xl" src={`src/assets/Avatar/${avatar}.png`} />
            </Flex>
            <Flex justifyContent="center" marginTop={2} marginBottom={4}>
              <Select
                w="30%"
                value={avatar}
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={email}
            />
            <Input
              marginBottom={4}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={phone || "Phone Number [Optional]"}
            />
            <Input
              marginBottom={4}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder={firstName}
            />
            <Input
              marginBottom={4}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder={lastName}
            />
            <Input
              marginBottom={4}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter your current password"
            />
            <Input
              marginBottom={4}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter your new password"
            />
            <Flex justifyContent="center" marginTop={2}>
              <Button
                colorScheme="green"
                width={100}
                onClick={sentChangeProfile}
              >
                Save
              </Button>
            </Flex>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ChangeProfile;
