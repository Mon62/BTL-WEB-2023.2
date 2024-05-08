import React from "react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { Button, Container, Flex } from "@chakra-ui/react";

export const Archive = () => {
  return (
    <Container
      className="mw-100"
    >
      <Flex>
        <Button
          className="p-0 mb-3"
          gap={4}
          dir="row"
          bg={"white.alpha300"}
          fontSize={"20px"}
          onClick={() => window.history.back()}
        >
          <ArrowBackIcon />
          Archive
        </Button>
      </Flex>
      <h6 className="fs-6 fw-normal">
        Only you can see your archived stories unless you choose to share them.
      </h6>
      <hr className="solid m-0" />
    </Container>
  );
};
