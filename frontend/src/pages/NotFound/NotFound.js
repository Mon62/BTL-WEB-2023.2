import React, { useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import { Navigate, useNavigate } from "react-router-dom";

export const NotFound = () => {
  const toast = useToast();
  const currentUser = sessionStorage.getItem("currentUser");
  const navigate = useNavigate();

  useEffect(() => {
    toast({
      title: "Bạn đang truy cập vào URL không hợp lệ",
      // description: "You are accessing an invalid URL",
      status: "warning",
      duration: 2500,
      isClosable: true,
      position: "top-right",
    });
    setTimeout(function () {
      currentUser === null ? navigate("/login") : navigate("/home");
    }, 3000);
  }, []);
  return <div></div>;
};
