import React, { useContext } from "react";
import { AuthContext } from "../containers/AuthProvider";
import { useHistory } from "react-router-dom";
export default function Home(props) {
    const { admin } = useContext(AuthContext);
    console.log(admin);
    const history = useHistory();
    if (!admin) {
        history.push("/login");
    }
    return <div>Home</div>;
}
