import Footer from "./website/foother/Foother"
import Navbar from "./website/header/Navbar"
import { WEBRoute } from "./website/routes/Routes"


const AppWeb = () => {
    return (
        <>
            <div className='container-fluid p-0'>
                <Navbar />
                <div className='container'>
                    <WEBRoute />
                </div>
                <Footer />
            </div>

        </>
    )
}

export default AppWeb
