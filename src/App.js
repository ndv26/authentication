import { useContext } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import AuthContext from "./store/auth-context";
import Layout from "./components/Layout/Layout";
import ProfilePage from "./pages/ProfilePage";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";

function App() {
    const authContext = useContext(AuthContext);

    return (
        <Layout>
            <Switch>
                <Route path="/" exact>
                    <HomePage />
                </Route>
                {!authContext.isLoggedIn && (
                    <Route path="/auth">
                        <AuthPage />
                    </Route>
                )}
                <Route path="/profile">
                    {authContext.isLoggedIn && <ProfilePage />}
                    {!authContext.isLoggedIn && <Redirect to="/auth" />}
                </Route>
                <Route path="*">
                    <Redirect to="/" />
                </Route>
            </Switch>
        </Layout>
    );
}

export default App;
