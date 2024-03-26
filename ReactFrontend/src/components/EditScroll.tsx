import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  Input,
  Flex,
  Textarea,
} from "@chakra-ui/react";

import { AiOutlineEdit } from "react-icons/ai";
import { useTokenContext } from "./TokenContext";
import { useState } from "react";
import api from "../api/axiosConfig";

type EditScrollProps = {
  scrollId: number;
  scrollName: string;
  scrollContent: string;
  scrollDescription: string;
};

function EditScroll({
  scrollId,
  scrollContent,
  scrollName,
  scrollDescription,
}: EditScrollProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { token, setToken } = useTokenContext();
  const [scrollNameState, setScrollNameState] = useState<string>(scrollName);
  const [scrollIdState] = useState<number>(scrollId);
  const [scrollContentState, setScrollContentState] =
    useState<string>(scrollContent);
  const [scrollDescriptionState, setScrollDescriptionState] =
    useState<string>(scrollDescription);

  const sentScrollUpdate = () => {
    api
      .post("/scrolls/update", {
        scrollIdState,
        scrollNameState,
        scrollDescriptionState,
        scrollContentState,
        token,
      })
      .then((response) => {
        if (response.status === 200) {
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

  function deleteScroll() {
    api
      .post("/scrolls/delete", { scrollIdState, token })
      .then((response) => {
        if (response.status === 200) {
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
  }

  return (
    <>
      <AiOutlineEdit size="1.5em" onClick={onOpen} />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Scroll</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              maxLength={50}
              marginBottom={4}
              value={scrollNameState}
              onChange={(e) => setScrollNameState(e.target.value)}
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
              value={scrollDescriptionState}
              onChange={(e) => setScrollDescriptionState(e.target.value)}
              placeholder="Scroll Description Max 150 Characters"
              maxLength={150}
            />
            <Textarea
              height="200px"
              marginBottom={4}
              value={scrollContentState}
              onChange={(e) => setScrollContentState(e.target.value)}
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
            <Flex justifyContent="center" marginTop={2}>
              <Button
                colorScheme="green"
                mr={3}
                width={40}
                onClick={sentScrollUpdate}
              >
                Save
              </Button>
            </Flex>
            <Flex justifyContent="center" marginTop={6}>
              <Button
                colorScheme="red"
                mr={3}
                width={40}
                onClick={deleteScroll}
              >
                ! Delete Scroll !
              </Button>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default EditScroll;
