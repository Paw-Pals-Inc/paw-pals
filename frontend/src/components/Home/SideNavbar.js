import { react, useState, useEffect } from "react";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import LogoutIcon from "@mui/icons-material/Logout";
import HomeIcon from "@mui/icons-material/Home";
import ChatIcon from "@mui/icons-material/Chat";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import Person4Icon from "@mui/icons-material/Person4";
import { useNavigate, useLocation } from "react-router-dom";
import logo_top from "../../assets/logo_top.png";

function SideNavbar({ onLogout, userProfile }) {
  const pageNames = ["Home", "Chats", "Favorites/Starred", "Profile"];
  const navigate = useNavigate();
  const location = useLocation().pathname;
  const [mobileOpen, setMobileOpen] = useState(false);
  const { firstName, petName } = userProfile || "";
  const [selected, setSelected] = useState("");

  useEffect(() => {
    const convertUrlToPageName = (url) => {
      let path = url.slice(1);
      let firstLetter = path[0];
      let pageName;
      switch (firstLetter) {
        case "h":
          pageName = pageNames[0];
          break;
        case "c":
          pageName = pageNames[1];
          break;
        case "f":
          pageName = pageNames[2];
          break;
        case "p":
          pageName = pageNames[3];
          break;
        default:
          break;
      }
      return pageName;
    };
    setSelected(convertUrlToPageName(location));
  }, [location]);

  const drawerWidth = 240;
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavClick = (text, e) => {
    setSelected(text);
    navigate(convertPageNameToUrl(text));
  };

  const convertPageNameToUrl = (pageName) => {
    let path = pageName.toLowerCase();
    if (path === "favorites/starred") path = "favorites";
    let url = "/" + path;
    return url;
  };

  // Function to log out user
  const handleLogout = () => {
    onLogout();
    navigate("/");
  };

  const drawer = (
    <div>
      <Toolbar>
        <Box
          className="logo-container"
          sizes="large"
          component="img"
          sx={{ maxHeight: "140px", width: "100%", cursor: "pointer" }}
          alt="Logo"
          src={logo_top}
          onClick={() => navigate("/home")}
        />
      </Toolbar>
      <Divider />

      <List disablePadding>
        {pageNames.map((text, index) => (
          <ListItem key={text} disablePadding selected={selected === text}>
            <ListItemButton
              style={selected === text ? { backgroundColor: "#FF8854" } : {}}
              onClick={(e) => handleNavClick(text, e)}
            >
              <ListItemIcon>
                {index === 0 ? <HomeIcon /> : ""}
                {index === 1 ? <ChatIcon /> : ""}
                {index === 2 ? <StarBorderIcon /> : ""}
                {index === 3 ? <Person4Icon /> : ""}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {["Logout"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <div>
      <Drawer
        // container={container}
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
        open
      >
        {drawer}
      </Drawer>

      <div className="sidemenu"></div>
    </div>
  );
}

export default SideNavbar;
