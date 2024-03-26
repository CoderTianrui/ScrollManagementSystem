import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  Input,
  Textarea,
  Flex,
} from "@chakra-ui/react";
import { useState } from "react";
import api from "../api/axiosConfig";
import { useTokenContext } from "./TokenContext";

function Upload() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [scrollName, setScrollName] = useState("");
  const [scrollDescription, setScrollDescription] = useState("");
  const [scrollContent, setScrollContent] = useState("");
  const { token, setToken } = useTokenContext();
  const clearInput = () => {
    setScrollName("");
    setScrollDescription("");
    setScrollContent("");
  };
  const sentScroll = () => {
    api
      .post("/scrolls/upload", {
        scrollName,
        scrollDescription,
        scrollContent,
        token,
      })
      .then((response) => {
        if (response.status === 200) {
          clearInput();
          onClose();
          window.location.reload();
        }
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.data == "Token invalid") {
            setToken("");
            alert("Please login again");
            window.location.reload();
          } else {
            alert(error.response.data);
          }
        } else {
          console.log(error);
        }
      });
  };

  return (
    <>
      {token && (
      <Button onClick={onOpen} colorScheme="cyan" marginLeft={10} width={170}>
        Upload Scroll
      </Button>
      )}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Upload</ModalHeader>
          <ModalCloseButton onClick={clearInput} />
          <ModalBody>
            <Input
              maxLength={50}
              marginBottom={4}
              value={scrollName}
              onChange={(e) => setScrollName(e.target.value)}
              placeholder="Scroll Name Max 50 Characters"
              onKeyDown={(event) => {
                if (!/[a-zA-Z0-9 ,.'/:;@!$%&()*?"-]/.test(event.key)) {
                  event.preventDefault();
                }
              }}
            />
            <Textarea
              onKeyDown={(event) => {
                if (!/[a-zA-Z0-9 ,.'/:;@!$%&()*?"-]/.test(event.key)) {
                  event.preventDefault();
                }
              }}
              marginBottom={4}
              value={scrollDescription}
              onChange={(e) => setScrollDescription(e.target.value)}
              placeholder="Scroll Description Max 150 Characters"
              maxLength={150}
            />
            <Textarea
              height="200px"
              marginBottom={4}
              value={scrollContent}
              onChange={(e) => setScrollContent(e.target.value)}
              placeholder="Scroll Content"
              onKeyDown={(event) => {
                if (
                  !/[0-1]/.test(event.key) &&
                  event.key !== "Backspace" &&
                  event.key !== "Tab"
                ) {
                  event.preventDefault();
                }
              }}
            />
            <Flex justifyContent="center" marginTop={4}>
              <Button colorScheme="green" mr={3} onClick={sentScroll} width={40}>
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

export default Upload;
