import { Box, Flex } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
const PageLayout = ({ children }) => {
  const { pathname } = useLocation();
  return (
    <Flex>
      {/*sidebar in the left*/}
      {pathname !== "/login" &&
      pathname !== "/signup" &&
      pathname !== "/password/reset" &&
      pathname !== "/login/" &&
      pathname !== "/signup/" &&
      pathname !== "/password/reset/" &&
      pathname !== "/" ? (
        <Box w={{ base: "70px", md: "240px" }}  position={"fixed"} top="0" height={"100vh"} >
          <Sidebar />
        </Box>
      ) : null}
      {/*contents in the right*/}
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
  );
};
export default PageLayout;
