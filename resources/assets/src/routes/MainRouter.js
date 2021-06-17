import { Check } from "@material-ui/icons";
import React, { useContext, Suspense } from "react";
import { AuthContext } from "../containers/AuthProvider";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Layout from "../containers/Layout/Layout";
import AdminLogin from "../containers/Auth/Login";
import ResetPassword from "../containers/Auth/ForgetPassword";
import AppLoading from "../components/Loading";
import Home from "../containers/Home";

export default function MainRouter(props) {
    const { admin, perms } = useContext(AuthContext);

    function checkPerm(perm) {
        if (!perm) {
            return true;
        }
        if (typeof perm == "array") {
            perm.forEach((e) => {
                if (!perms.map((p) => p.name).some(e)) {
                    return false;
                }
            });
        } else {
            return perms.map((p) => p.name).some(perm);
        }
    }

    function render(route) {
        if (checkPerm(route?.perm)) {
        }
    }

    return (
        <Router>
            <Suspense fallback={<AppLoading />}>
                <Switch>
                    <Route
                        path={"/login"}
                        name="Login"
                        exact
                        strict
                        component={AdminLogin}
                    />
                    <Route
                        path={"/forgotPassword"}
                        name="ForgotPassword"
                        exact
                        strict
                        component={AdminLogin}
                    />
                    <Route
                        path={"/resetPassword/:id/:name"}
                        name="ResetPassword"
                        exact
                        strict
                        component={ResetPassword}
                    />
                    <Route
                        path={"/"}
                        name="management"
                        component={admin ? Layout : AdminLogin}
                    />
                </Switch>
            </Suspense>
        </Router>
    );
}
