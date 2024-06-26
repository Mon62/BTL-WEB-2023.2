import React, { useRef, useState, useEffect } from "react";
import { Box, Button, Center, IconButton, useToast } from "@chakra-ui/react";
import { CreatePostLogo } from "../../assets/constants.js";
import { CloseButton, Modal } from "react-bootstrap";
import { LuImagePlus } from "react-icons/lu";
//import { Button } from "react-bootstrap";
import Image from "react-bootstrap/Image";
import Form from "react-bootstrap/Form";
import AlertModal from "../Sidebar/AlertModal.js";
import { Success, Error } from "../../models/Toast.js";
import { createStory, getMusicFiles } from "../../api/Api.js";
import { Select } from "@chakra-ui/react";
import { Story } from "../../models/Story.js";

const CreateStoryModal = (props) => {
  const [caption, setCaption] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [file, setFile] = useState(null);
  const [view, setView] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [music, setMusic] = useState([]);
  const [selectedMusic, setSelectedMusic] = useState("");
  const currentUser = sessionStorage.getItem("currentUser");
  const toast = useToast();
  useEffect(() => {
    const fetchMusicData = async () => {
      try {
        const response = await getMusicFiles();
        const musicData = response.data;

        // Filter duplicates to ensure a clean music state
        const uniqueMusicURL = Array.from(new Set(musicData.data)); // Use Set for efficient uniqueness check

        setMusic(uniqueMusicURL); // Update music state with unique URLs
      } catch (error) {
        console.error("Error fetching music files:", error);
        // Handle error appropriately (e.g., display an error message)
      }
    };

    // Fetch music data only once on component mount
    fetchMusicData();
  }, []); // Empty dependency array for one-time execution

  useEffect(() => {
    if (file === null) {
      setDisabled(true);
      setLoading(false);
    } else {
      setDisabled(false);
      setLoading(false);
    }
  }, [file]);
  //function to rerender the image whenever the file changes
  useEffect(() => {
    if (!file) {
      setView(null);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setView(objectUrl);
    console.log(file.type);
    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setDisabled(true);
    setLoading(true)
    const storyData = new Story(currentUser, caption, file, selectedMusic);
    console.log(storyData);

    createStory(storyData)
      .then((res) => {
        setLoading(false)
        toast(new Success(res));
        discard();
      })
      .catch((err) => {
        // console.log(err);
        console.log(err.response.data.message);
        toast(new Error(err));
      });
  };

  const handleChangeMusic = (event) => {
    setSelectedMusic(event.target.value);
  };
  //handle the modal close
  const handleClose = () => {
    if (view) {
      setShowAlert(true);
    } else {
      setShowAlert(false);
      if (typeof props.func === "function") {
        props.func();
      }
    }
  };
  const discard = () => {
    if (typeof props.func === "function") {
      props.func();
    }
    setFile(null);
    setShowAlert(false);
  };

  //function to get the file
  const handleFileChange = (event) => {
    if (!event.target.files || event.target.files.length === 0) {
      setFile(null);
      return;
    }
    setFile(event.target.files[0]);
  };

  const inputRef = useRef();

  const handleClick = () => {
    inputRef.current.click();
  };

  //cancel the image preview
  const handleCloseView = () => {
    setFile(null);
    inputRef.current.value = null;
  };

  return (
    <>
      <Modal
        show={props.show}
        onHide={handleClose}
        centered
        animation={false}
        style={{ maxHeight: "700px", backdropFilter: "blur(10px)" }}
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ textAlign: "center", width: "100%" }}>
            Create new story
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group
            className="mb-3 "
            style={{ border: "1px solid #000", borderRadius: 6 }}
          >
            <Form.Control
              type="text"
              placeholder="Story Caption..."
              rows={3}
              as="textarea"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Control
              ref={inputRef}
              type="file"
              id="fileInput"
              hidden
              onChange={handleFileChange}
              accept=".mp4, .mov, .jpg, .jpeg, .png"
            />

            {file !== null ? (
              <Box>
                <CloseButton onClick={handleCloseView} />
                {file.type.includes("video/") ? (
                  <video src={view} controls playsinline></video>
                ) : (
                  <Image src={view} rounded fluid />
                )}
              </Box>
            ) : (
              <IconButton
                icon={<LuImagePlus size={20} />}
                onClick={handleClick}
              />
            )}

            <Select onChange={handleChangeMusic}>
              <option value="" disabled selected hidden>
                Select an option
              </option>
              {music.map((song) => {
                return <option value={song.url}>{song.name}</option>;
              })}
            </Select>
            <audio key={selectedMusic} controls autoPlay>
              <source src={selectedMusic} type="audio/mp3" />
            </audio>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Button onClick={handleSubmit} isDisabled={disabled} colorScheme="blue" isLoading={loading}>
            Create
          </Button>
          
        </Modal.Footer>
      </Modal>
      <AlertModal
        showAtt={showAlert}
        handleCloseAtt={() => setShowAlert(false)}
        Cancel={() => setShowAlert(false)}
        Discard={discard}
        title="Discard story?"
      />
    </>
  );
};

export default CreateStoryModal;
