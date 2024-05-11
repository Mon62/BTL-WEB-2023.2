import React, { useEffect, useRef, useState } from 'react'
import { Box, Flex, Tooltip, IconButton, useToast } from "@chakra-ui/react";
import { CreatePostLogo } from "../../assets/constants";
import { CloseButton, Modal } from "react-bootstrap"
import { LuImagePlus } from "react-icons/lu";
import { Button } from 'react-bootstrap';
import Image from 'react-bootstrap/Image';
import Form from 'react-bootstrap/Form';
import Carousel from 'react-bootstrap/Carousel';
import AlertModal from './AlertModal';
import { Success, Error } from "../../models/Toast.js";
import {createPost} from "../../api/Api.js"
import {Post} from "../../models/Post.js"



const Create = () => {
    const [show, setShow] = useState(false) //modal view
    const [view, setView] = useState([])
    const [caption, setCaption] = useState("")
    const [showAlert, setShowAlert] = useState(false)
    const [disablePost, setDisablePost] = useState(true) 
    const [variant, setVariant] = useState("secondary")
    //const [selectedFileURL, setSelectedFileURL] = useState([])
    const username = sessionStorage.getItem("currentUser")
    const toast= useToast()

    const handleSubmit =(event) => {
        event.preventDefault();
        setDisablePost(true)
        const files = view.map((file)=>{
            return file.originalFile
        })
        let postData = new Post(username,caption,files);
        console.log(postData)
        
        createPost(postData)
        .then((res) => {
            toast(new Success(res));
            discard()
          })
          .catch((err) => {
            // console.log(err);
            console.log(err.response.data.message);
            toast(new Error(err));
          });
        console.log(postData.files)
    }
    //handle the modal show
    const handleShow = () => setShow(true)

    //handle the modal close
    const handleClose = () => {
        if ((view.length !== 0) || (caption.length !== 0)) {
            setShowAlert(true)
        } else {
            setShowAlert(false)
            setShow(false)
        }
    }
    const discard = () =>{
        setCaption("")
        setShow(false);
        setView([]); 
        //setSelectedFileURL([])
        setShowAlert(false)
    }

    //function to get the file 
    const handleFileChange = (event) => {
        if (!event.target.files || event.target.files.length === 0) {
            setView([])
            //setSelectedFileURL([])
            return
        }
        const selectedFile = event.target.files;
        const fileArray = Array.from(selectedFile)
        //setFiles((prevFiles) => prevFiles.concat(fileArray));
        //console.log(files)
        const viewFileArray = fileArray.map((file) => {
            return {
                originalFile: file,
                url: URL.createObjectURL(file),
                fileType: file.type
            }
        })
        setView((prevFiles) => prevFiles.concat(viewFileArray));
        console.log(selectedFile)
    };

    useEffect(() => {
        if ((view.length === 0) && (caption.length === 0)) {
            setDisablePost(true);
            setVariant("secondary")
        }
        else {
            setDisablePost(false);
            setVariant("primary")}
    },[view, caption])
    
    const inputRef = useRef()

    const handleClick = () => {
        inputRef.current.click()
    }

    //cancel the image preview
    const handleCloseView = () => {
        setView([]);
        //setSelectedFileURL([])
        inputRef.current.value = null;
    }
    return (
        <Tooltip
            hasArrow
            label="Create"
            placement="right"
            ml={1}
            openDelay={400}
            display={{ base: "block", md: "none" }}
        >
            <>
                <Flex
                    alignItems={"center"}
                    gap={4}
                    _hover={{ bg: "blackAlpha.200" }}
                    borderRadius={6}
                    p={2}
                    w={{ base: 10, md: "full" }}
                    justifyContent={{ base: "center", md: "flex-start" }}
                    onClick={handleShow}
                >
                    <CreatePostLogo />
                    <Box display={{ base: "none", md: "block" }}>Create</Box>
                </Flex>

                <Modal show={show} onHide={handleClose} centered animation={false} style={{maxHeight: "700px"}}>
                    <Modal.Header closeButton>
                        <Modal.Title style={{ textAlign: "center", width: "100%" }}>Create new post</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className='mb-3 ' style={{ border: "1px solid #000", borderRadius: 6 }}>
                                <Form.Control
                                    type="text"
                                    placeholder="Post Caption..."
                                    rows={4}
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
                                    multiple
                                    onChange={handleFileChange}
                                    accept='.mp4, .mov, .jpg, .jpeg, .png'
                                />
                                {view.length !== 0 ?
                                    (<>
                                        <CloseButton onClick={handleCloseView} />
                                        <Carousel data-bs-theme="light" interval={null} indicators={false}>
                                        
                                            {view.map((file, index) => {
                                                return (
                                                    <Carousel.Item>
                                                        <Flex key={index} style={{width: "450px", maxHeight:"300px"}}>
                                                            {file.fileType.includes("video/") ?
                                                                <video src={file.url} controls playsinline ></video>
                                                                : <Image src={file.url} rounded fluid />}
                                                        </Flex>
                                                    </Carousel.Item>
                                                )
                                            })}
                                        </Carousel>
                                    </>)
                                    : <IconButton icon={<LuImagePlus size={20} />} onClick={handleClick} />}

                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={handleSubmit} disabled={disablePost} variant={variant}>Post</Button>
                    </Modal.Footer>
                </Modal>
                <AlertModal 
                    showAtt={showAlert} 
                    handleCloseAtt={()=>setShowAlert(false)}
                    Cancel={()=>setShowAlert(false)}
                    Discard={discard} 
                    title="Discard post?"
                /> 
            </>
        </Tooltip>

    )
}

export default Create
