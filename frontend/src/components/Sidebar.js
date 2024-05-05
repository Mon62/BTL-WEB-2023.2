import { Box, Flex, Link, MenuDivider, Tooltip, useToast } from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { InstagramLogo, InstagramMobileLogo } from "../assets/constants";
import SidebarItems from "./SidebarItems";
import { RxHamburgerMenu } from "react-icons/rx";
import { logout } from "./../api/Api.js";
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

} from '@chakra-ui/react'

//import useLogout from "../../hooks/useLogout";
//import SidebarItems from "./SidebarItems";

const Sidebar = () => {
	//const { handleLogout, isLoggingOut } = useLogout();
	const navigate = useNavigate()
	const toast = useToast()

	const [show, setShow] = useState(false)

	const handleClose= () => setShow(false)
	const handleShow = () => setShow(true)
	

	const handleLogout = (e) => {
		e.preventDefault();
		// Call API to login
		logout()
			.then((res) => {
				toast({
					title: 'Logging Out',
					description: "You need to log back in",
					status: 'loading',
					duration: 2000,
					isClosable: true,
				})
				setTimeout(() => navigate("/login"), 2000
				)
			})
			.catch((err) => {
				console.log(err.response.data);
			});

	}


	return (
		<Box
			height={"100vh"}
			borderRight={"1px solid"}
			borderColor={"blackAlpha.300"}
			py={8}
			position={"sticky"}
			top={0}
			left={0}
			px={{ base: 2, md: 4 }}
		>
			<Flex direction={"column"} gap={10} w='full' height={"full"}>
				<Link to={"/home"} as={RouterLink} pl={2} display={{ base: "none", md: "block" }} cursor='pointer'>
					<InstagramLogo />
				</Link>
				<Link
					to={"/home"}
					as={RouterLink}
					p={2}
					display={{ base: "block", md: "none" }}
					borderRadius={6}
					_hover={{
						bg: "blackAlpha.200",
					}}
					w={10}
					cursor='pointer'
				>
					<InstagramMobileLogo />
				</Link>
				<Flex direction={"column"} gap={5} cursor={"pointer"}>
					<SidebarItems />
				</Flex>
				{/*Create menu */}
				<Tooltip
					hasArrow
					label={"More"}
					placement='right'
					ml={1}
					openDelay={500}
					display={{ base: "block", md: "none" }}

				>
					<Menu >
						<Flex
							//onClick={handleLogout}
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
							<Flex >
								<RxHamburgerMenu size={25} />
								<Box display={{ base: "none", md: "block" }} px={5} >More</Box>
							</Flex>
						</Flex>

						<MenuList style={{boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)"}}>
							{/* MenuItems are not rendered unless Menu is open */}
							<MenuItem icon={<FaRegBookmark size={20}/>}>Saved</MenuItem>
							<MenuItem icon={<HiMiniPencilSquare size={20} />}>Edit profile</MenuItem>
							<MenuItem icon={<MdLockReset size={20}/>}>Reset Password</MenuItem>
							<MenuDivider />

							<MenuItem icon={<PiUserSwitch size={20}/>} onClick={handleShow}>
								Switch account
							</MenuItem>
							<SwitchAccountForm showAtt={show} handleCloseAtt={handleClose} />

							<MenuItem icon={<IoIosLogOut size={20} />} onClick={handleLogout}>Log out</MenuItem>
						</MenuList>
					</Menu>
				</Tooltip>

			</Flex>
		</Box>
	);
};

export default Sidebar;