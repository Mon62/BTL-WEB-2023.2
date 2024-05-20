import React, { useState, useEffect, useRef } from 'react';
import Stories from 'react-insta-stories';
import { Flex, CloseButton } from '@chakra-ui/react';
import Modal from 'react-modal';

const StoryView = (props) => {
    const [isPlaying, setIsPlaying] = useState(true);
    const storiesRef = useRef(null);
    const audioRefs = useRef([]);

    const handleStoryStart = (index) => {
        setIsPlaying(true);
        playAudio(index);
    };

    const handleStoryEnd = (index) => {
        pauseAudio(index);
    };

    /*const handleAllStoriesEnd = () => {
        props.handleClose();
    };*/

    useEffect(() => {
        return () => {
            // Cleanup logic if necessary
        };
    }, [props]);

    const playAudio = async (index) => {
        try {
            if (audioRefs.current[index]) {
                await audioRefs.current[index].play();
            }
        } catch (e) {
            console.error("Error playing audio:", e);
        }
    };

    const pauseAudio = (index) => {
        if (audioRefs.current[index]) {
            audioRefs.current[index].pause();
        }
    };

    /*const togglePlayPause = () => {
        if (storiesRef.current) {
            if (isPlaying) {
                storiesRef.current.pause();
                audioRefs.current.forEach(audio => audio.pause());
            } else {
                storiesRef.current.play();
                audioRefs.current.forEach(async (audio, index) => {
                    try {
                        await audio.play();
                    } catch (e) {
                        console.error(`Error playing audio for story ${index}:`, e);
                    }
                });
            }
            setIsPlaying(!isPlaying);
        }
    };*/

    return (
        <Modal
            isOpen={props.isOpen}
            onRequestClose={props.handleClose}
            contentLabel="Story Modal"
            style={{
                overlay: {
                    zIndex: 1500,
                    backgroundColor: 'transparent'
                },
                content: {
                    top: '0',
                    left: '0',
                    right: '0',
                    bottom: '0',
                    margin: 'auto',
                    overflow: 'hidden',
                }
            }}
            
        >
        
            <Flex bg={"#2c2c2c"} justifyContent={"center"} alignItems={"center"} position={"relative"} height={"100vh"}>
                <CloseButton size='lg' color={"white"} position={"absolute"} top={2} right={2} onClick={props.handleClose} />
                <Flex flex={1} justifyContent={"center"} alignItems={"center"}>
                    <Stories
                        ref={storiesRef}
                        stories={props.stories}
                        defaultInterval={1500}
                        width={375}
                        height={700}
                        isPaused={!isPlaying}
                        onAllStoriesEnd={props.handleClose}
                        onStoryEnd={(index) => handleStoryEnd(index)}
                        onStoryStart={(index) => handleStoryStart(index)}
                        preventDefault
                    />
                    {props.stories.map((story, index) => (
                        <audio
                            key={index}
                            ref={el => audioRefs.current[index] = el}
                            src={story.music}
                            hidden
                        />
                    ))}
                    {/*<Button onClick={togglePlayPause} position="absolute" bottom={5} colorScheme="teal">
                        {isPlaying ? 'Pause' : 'Play'}
                    </Button>*/}
                </Flex>
            </Flex>
        </Modal>
    );
}

export default StoryView;
