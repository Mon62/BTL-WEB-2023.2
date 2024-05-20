import { Box, Flex, useToast } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
const PageLayout = ({ children }) => {
  const { pathname } = useLocation();
  const currentUser = sessionStorage.getItem("currentUser");
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    if (
      pathname === "/" ||
      pathname === "/login" ||
      pathname === "/signup" ||
      pathname === "/password/reset"
    )
      return;
    if (currentUser === null || currentUser === "null") {
      console.log(currentUser, pathname);
      toast({
        title: "Vui lòng đăng nhập để sử dụng website",
        duration: 2000,
        status: "warning",
        isClosable: true,
        position: "top-right",
      });
      setTimeout(() => {
        navigate(`/`);
      }, 2000);
    }
  }, []);

  if (
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/password/reset" ||
    pathname === "/login/" ||
    pathname === "/signup/" ||
    pathname === "/password/reset/"
  )
    return (
      <Flex>
        <Box
          flex={1}
          w={{ base: "calc(100% - 70px)", md: "calc(100% - 240px)" }}
          mx={"auto"}
          p={4} // Khoảng cách padding cho nội dung
        >
          {children}
        </Box>
      </Flex>
    );

  return (
    currentUser !== null &&
    currentUser !== "null" && (
      <Flex>
        <Box
          w={{ base: "70px", md: "240px" }}
          position={"fixed"}
          top="0"
          height={"100vh"}
        >
          <Sidebar />
        </Box>

        <Box
          flex={1}
          w={{ base: "calc(100% - 70px)", md: "calc(100% - 240px)" }}
          mx={"auto"}
          ml={{ base: "70px", md: "240px" }} // Đẩy nội dung sang bên phải để không bị đè lên sidebar
          p={4} // Khoảng cách padding cho nội dung
        >
          {children}
        </Box>
      </Flex>
    )
  );
};
export default PageLayout;
