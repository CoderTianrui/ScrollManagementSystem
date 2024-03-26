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
  Text,
} from "@chakra-ui/react";

import { AiOutlineFolderView } from "react-icons/ai";
import { useTokenContext } from "./TokenContext";

type ViewScrollProps = {
  scrollId: number;
  scrollName: string;
  scrollContent: string;
};

function ViewScroll({ scrollId, scrollContent, scrollName }: ViewScrollProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { token, setToken } = useTokenContext();

  // Function to trigger the download
  const handleDownload = () => {
    // Create a Blob with the scroll content
    const blob = new Blob([scrollContent], { type: "text/plain" });

    // Create a temporary URL for the Blob
    const url = URL.createObjectURL(blob);

    // Create a temporary anchor element for triggering the download
    const a = document.createElement("a");
    a.href = url;
    a.download = `${scrollName}.txt`; // Set the file name

    // Trigger the click event on the anchor to start the download
    a.click();

    // Release the URL and remove the temporary anchor
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <AiOutlineFolderView size="1.5em" onClick={onOpen} />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Scroll Content</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>{scrollContent}</Text>
          </ModalBody>

          <ModalFooter>
            {/*<Button colorScheme="red" mr={3} onClick={onClose}>*/}
            {/*  Close*/}
            {/*</Button>*/}
            {token && (
                <Button colorScheme="blue" onClick={handleDownload}>Download</Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ViewScroll;
