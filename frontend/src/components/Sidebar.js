import { Box, Flex, Link, Tooltip, useToast } from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { InstagramLogo, InstagramMobileLogo } from "../assets/constants";
import SidebarItems from "./SidebarItems";
import { RxHamburgerMenu } from "react-icons/rx";
import { logout } from "./../api/Api.js";
import { IoIosSettings, IoIosLogOut } from "react-icons/io";
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

						<MenuList>
							{/* MenuItems are not rendered unless Menu is open */}

							<MenuItem icon={<IoIosSettings size={20} />}>Settings</MenuItem>
							<MenuItem icon={<IoIosLogOut size={20} />} onClick={handleLogout}>Log out</MenuItem>
						</MenuList>
					</Menu>
				</Tooltip>

			</Flex>
		</Box>
	);
};

export default Sidebar;