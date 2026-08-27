import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function AppShell() {
  return (
    <div className="app">
      <Navbar />
      <main className="main"><Outlet /></main>
      <footer className="footer">
        <div className="container footer-inner">
          <span>© {new Date().getFullYear()} FindBack</span>
          <span>Lost less. Found faster.</span>
        </div>
      </footer>
    </div>
  );
}