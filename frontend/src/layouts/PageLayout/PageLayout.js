import {Box, Flex} from "@chakra-ui/react"
import {useLocation} from "react-router-dom"
import Sidebar from "../../components/Sidebar.js"
const PageLayout = ({children}) =>{
    const {pathname} = useLocation();
    return(
<Flex>
    {/*sidebar in the left*/}
    {(pathname !== "/login" && pathname !== "/signup"  && pathname !== "/") ? (
        <Box w={{base: "70px", md: "240px"}}  style={{ position: "fixed", left: "0", top: "0" }}>
            <Sidebar/>
        </Box>
    ) : null}
    {/*contents in the right*/}
    <Box flex = {1}> 
        {children}
    </Box>
</Flex>
    )
}
export default PageLayout;
