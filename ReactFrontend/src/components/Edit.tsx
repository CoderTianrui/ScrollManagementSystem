// Edit.tsx

import { useState } from "react";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button } from "@chakra-ui/react";
import api from "../api/axiosConfig";
import { Scroll } from './Content.tsx';
import { useTokenContext } from "./TokenContext";

interface EditProps {
    scroll: Scroll;
    isOpen: boolean;
    onClose: () => void;
}

const Edit: React.FC<EditProps> = ({ scroll, isOpen, onClose }) => {
    const [newScrollName, setNewScrollName] = useState<string>("");
    const [newScrollDescription, setNewScrollDescription] = useState<string>("");
    const [newScrollContent, setNewScrollContent] = useState<string>("");
    const [isSaving, setIsSaving] = useState(false);
    const { token, role } = useTokenContext();

    // Function to check if user can edit this scroll
    const canEditScroll = () => {
        if (role === 'admin') {
            return true;  // Admin can edit all scrolls
        }
        // Assuming your scroll has an 'ownerId' that matches with a user identifier
        else if (role === 'user' && scroll.uploadUserId === Number(token)) {
            return true;  // User can edit only their own scrolls
        }

        return false;  // Guests or other roles can't edit
    };

    // If the user is not authorized to edit, simply return null or an alternative component
    if (!canEditScroll()) {
        return null;
    }
    const handleEditSubmit = () => {
        setIsSaving(true);
        // Call the API to update the scroll with the new details
        api.put(`/updateScroll/${scroll.scrollId}`, {
            scrollName: newScrollName,
            scrollDescription: newScrollDescription,
            scrollContent: newScrollContent
        })
            .then(response => {
                console.log("Scroll updated successfully:", response.data);
                alert("successful");
            })
            .catch(error => {
                console.error("Error updating scroll:", error);
                alert("failed");
            })
            .finally(() => {
                setIsSaving(false);
                onClose();
            });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Edit Scroll</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <form onSubmit={(event) => {
                        event.preventDefault();
                        handleEditSubmit();
                    }}>
                        <input
                            type="text"
                            value={newScrollName}
                            onChange={e => setNewScrollName(e.target.value)}
                            placeholder="New Scroll Name"
                        />
                        <input
                            type="text"
                            value={newScrollDescription}
                            onChange={e => setNewScrollDescription(e.target.value)}
                            placeholder="New Scroll Description"
                        />
                        <textarea
                            value={newScrollContent}
                            onChange={e => setNewScrollContent(e.target.value)}
                            placeholder="New Scroll Content"
                        />
                    </form>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={handleEditSubmit} isLoading={isSaving}>
                        Save & Close
                    </Button>
                    <Button variant="ghost" onClick={onClose}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default Edit;

export const canEditScroll = (role: string, scroll: Scroll, token: string) => {
    if (role === 'admin') {
        return true;  // Admin can edit all scrolls
    }
    // Assuming your scroll has an 'ownerId' that matches with a user identifier
    else if (role === 'user' && scroll.uploadUserId === Number(token)) {
        return true;  // User can edit only their own scrolls
    }

    return false;  // Guests or other roles can't edit
};

