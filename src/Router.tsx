import { Route, BrowserRouter, Routes } from "react-router-dom";
import HomePage from "@/pages/Home";
import { ProfilePage } from "@/pages/ProfilePage";
import { ProfileCreatePage } from "@/pages/ProfileCreatePage";
import SessionAvailablePage from "@/pages/SessionAvailablePage";
import SessionBookPage from "./pages/SessionBookPage";
import SessionScheduledPage from "./pages/SessionScheduledPage";
import SessionTypesPage from "./pages/SessionTypes";
import AvailabilityPage from "./pages/Availability";
import { useLogout, useProfileValue } from "./context/ProfileContext";
import { useWeb3React } from "@web3-react/core";
import { useNavigate } from "react-router";
import React, { useEffect } from "react";

export default function Router() {
  return (
    <div className="Router">
      <BrowserRouter>
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/create" element={<ProfileCreatePage />} />
          <Route
            path="/session-types"
            element={
              <RequireAuth>
                <SessionTypesPage />
              </RequireAuth>
            }
          />
          <Route
            path="/availability"
            element={
              <RequireAuth>
                <AvailabilityPage />
              </RequireAuth>
            }
          />
          <Route path="/session/:sessionId">
            <Route path="available" element={<SessionAvailablePage />} />
            <Route path="book" element={<SessionBookPage />} />
            <Route path="scheduled" element={<SessionScheduledPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}
const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const settings = useProfileValue();
  const { account } = useWeb3React();
  const logout = useLogout()
  useEffect(() => {
    if (settings.profile?.wallet) {
      if (account != settings.profile?.wallet) logout();
    }
  }, [account]);
  return children;
};
