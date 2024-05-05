import {Box, Flex} from "@chakra-ui/react"
import {useLocation} from "react-router-dom"
import Sidebar from "../../components/Sidebar.js"
const PageLayout = ({children}) =>{
    const {pathname} = useLocation();
    return(
<Flex>
    {/*sidebar in the left*/}
    {(pathname !== "/login" && pathname !== "/signup"  && pathname !== "/password/reset" && pathname !== "/" && pathname !== "/profile") ? (
        <Box w={{ base: "70px", md: "240px" }} display={'sticky'}>
					<Sidebar />
				</Box>
    ) : null}
    {/*contents in the right*/}
    <Box flex={1} w={{ base: "calc(100% - 70px)", md: "calc(100% - 240px)" }} mx={"auto"}>
				{children}
			</Box>
</Flex>
    )
}
export default PageLayout;
