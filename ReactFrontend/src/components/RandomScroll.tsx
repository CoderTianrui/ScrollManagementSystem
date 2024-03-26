import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import api from "../api/axiosConfig";
import { useEffect, useState } from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import useUser from "./useUser";

interface Scroll {
  scrollId: number;
  scrollName: string;
  scrollDescription: string;
  scrollContent: string;
  likes: number;
  downloads: number;
  uploadUserName: string;
  uploadUserId: number;
  uploadDate: string;
  lastModified: string;
}

function RandomScroll() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, token, setRefreash, refreash } = useUser();
  const [randomScroll, setRandomScroll] = useState<Scroll>();

  const getRandomScroll = () => {
    api
      .get<Scroll>("/scrolls/randomScroll")
      .then((res) => setRandomScroll(res.data))
      .catch((err) => console.log(err.message));
  };

  const toggleLike = () => {
    if (!token) return alert("Please login to like a scroll");
    api
      .post("/scrolls/like", {
        token,
        scrollId: randomScroll?.scrollId,
      })
      .then((res) => {
        if (res.status === 200) {
          setRefreash(!refreash);
        }
      })
      .catch((err) => console.log(err.message));
  };

  useEffect(() => {
    getRandomScroll();
  }, []);

  return (
    <>
      <Button onClick={onOpen} colorScheme="yellow" marginLeft={10} width={170}>
        Scroll Of The Day
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {randomScroll?.scrollName}
            <Text>By: {randomScroll?.uploadUserName}</Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text marginBottom={5}>{randomScroll?.scrollDescription}</Text>
            <Text>{randomScroll?.scrollContent}</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="gray" mr={3} width={100} onClick={toggleLike}>
              Like
              {(randomScroll && user?.likeScrollIds.includes(randomScroll?.scrollId)) ? (
                <AiFillHeart fontSize={23} color="#ff6b81" />
              ) : (
                <AiOutlineHeart fontSize={23} />
              )}
            </Button>
            <Button
              colorScheme="blackAlpha"
              mr={3}
              onClick={onClose}
              width={100}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default RandomScroll;
