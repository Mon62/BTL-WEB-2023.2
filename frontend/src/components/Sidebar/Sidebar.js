import {
  Box,
  Flex,
  Link,
  MenuDivider,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { InstagramLogo, InstagramMobileLogo } from "../../assets/constants.js";
import SidebarItems from "./SidebarItems";
import { RxHamburgerMenu } from "react-icons/rx";
import { logout } from "../../api/Api.js";
import { IoIosLogOut } from "react-icons/io";
import { HiMiniPencilSquare } from "react-icons/hi2";
import { FaRegBookmark } from "react-icons/fa6";
import { PiUserSwitch } from "react-icons/pi";
import { MdLockReset } from "react-icons/md";
import { useState } from "react";
import SwitchAccountForm from "./SwitchAccountForm.js";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
} from "@chakra-ui/react";
import { ChangePasswordDialog } from "./More/ChangePasswordDialog.js";

const Sidebar = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const currentUser = sessionStorage.getItem("currentUser");
  const [show, setShow] = useState(false);
  const {
    isOpen: isOpenDialog,
    onOpen: onOpenDialog,
    onClose: onCloseDialog,
  } = useDisclosure();
  const {
    isOpen: isOpenModal,
    onOpen: onOpenModal,
    onClose: onCloseModal,
  } = useDisclosure();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleLogout = (e) => {
    e.preventDefault();
    // Call API to login
    logout()
      .then((res) => {
        toast({
          title: "Đăng xuất",
          description: "Bạn cần đăng nhập lại",
          status: "loading",
          duration: 2000,
          isClosable: true,
          position: "top-right",
        });
        sessionStorage.setItem("currentUser", null);
        sessionStorage.setItem("accessToken", null);
        sessionStorage.setItem("email", null);
        setTimeout(() => navigate("/login"), 2000);
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  };

  return (
    <Box
      zIndex={1500}
      height={"100vh"}
      borderRight={"1px solid"}
      borderColor={"blackAlpha.300"}
      py={8}
      position={"sticky"}
      top={0}
      left={0}
      px={{ base: 2, md: 4 }}
    >
      <Flex direction={"column"} gap={10} w="full" height={"full"}>
        {/* <img src={"../../assets/logo.png"} alt="logo"/> */}
        {/* <text fontFamily="Billabong">Namsocial</text> */}
        {/* <Link
          to={"/home"}
          as={RouterLink}
          p={2}
          display={{ base: "block", md: "none" }}
          borderRadius={6}
          _hover={{
            bg: "blackAlpha.200",
          }}
          w={10}
          cursor="pointer"
        >
          <InstagramMobileLogo />
        </Link> */}
        <Flex direction={"column"} gap={5} cursor={"pointer"} mt={10}>
          <SidebarItems />
        </Flex>
        {/*Create menu */}
        <Tooltip
          hasArrow
          label={"More"}
          placement="right"
          ml={1}
          openDelay={500}
          display={{ base: "block", md: "none" }}
        >
          <Menu>
            <Flex
              alignItems={"center"}
              gap={4}
              _hover={{ bg: "blackAlpha.200" }}
              borderRadius={6}
              p={2}
              w={{ base: 10, md: "full" }}
              mt={"auto"}
              justifyContent={{ base: "center", md: "flex-start" }}
              cursor={"pointer"}
              as={MenuButton}
            >
              <Flex>
                <RxHamburgerMenu size={25} />
                <Box display={{ base: "none", md: "block" }} px={5}>
                  More
                </Box>
              </Flex>
            </Flex>

            <MenuList style={{ boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)" }}>
              {/* MenuItems are not rendered unless Menu is open */}
              <MenuItem
                icon={<FaRegBookmark size={20} />}
                onClick={() => navigate(`/profile/${currentUser}/saved`)}
              >
                Saved
              </MenuItem>

              <MenuItem icon={<MdLockReset size={20} />} onClick={onOpenDialog}>
                Change Password
                <ChangePasswordDialog
                  isOpen={isOpenDialog}
                  onClose={onCloseDialog}
                  email={sessionStorage.getItem("email")}
                />
              </MenuItem>
              <MenuDivider />

              <MenuItem icon={<PiUserSwitch size={20} />} onClick={handleShow}>
                Switch account
              </MenuItem>
              <SwitchAccountForm showAtt={show} handleCloseAtt={handleClose} />

              <MenuItem icon={<IoIosLogOut size={20} />} onClick={handleLogout}>
                Log out
              </MenuItem>
            </MenuList>
          </Menu>
        </Tooltip>
      </Flex>
    </Box>
  );
};

export default Sidebar;
