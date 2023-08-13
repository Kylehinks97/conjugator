import {Link} from "react-router-dom"

export default function Home() {



    return (
        <>
        <div className="wrapper">
            <Link to="/learn"><button>Learn</button></Link>
        </div>
        </>
    )
}