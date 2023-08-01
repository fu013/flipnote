/* eslint-disable jsx-a11y/alt-text */
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { pageGroup } from "config/pageSetting.config";
import styled from "@emotion/styled";
import { getImgURL } from "lib/getImgURL";

interface Props {
  window?: () => Window;
}

const drawerWidth = 240;
const LogoContainer = styled.div`
  display: inline-flex;
  align-items: center;
`;

const LogoImage = styled.img`
  width: 3rem;
  max-height: 100%;
  margin-right: 0.75rem;
`;

const LogoText = styled.span``;

export default function Nav(props: Props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const navigate = useNavigate();
  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };
  const handlePageMove = (url: string) => {
    navigate(url);
  };

  const Logo = () => {
    return (
      <LogoContainer>
        <LogoImage src={getImgURL("favicon.png")} />
        <LogoText>MapleFilpnote</LogoText>
      </LogoContainer>
    );
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2, fontWeight: "bold" }}>
        <Logo />
      </Typography>
      <Divider />
      <List>
        {Object.entries(pageGroup).map((arrStr, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton
              sx={{ textAlign: "center" }}
              onClick={() => handlePageMove(arrStr[1][0][arrStr[0]])}
            >
              <ListItemText primary={arrStr[0]} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar component="nav">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon sx={{ width: "2em", height: "2em" }} />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              display: {
                xs: "none",
                sm: "block",
                fontSize: "1.5rem",
                fontWeight: "bold",
              },
            }}
            onClick={() => handlePageMove(`/`)}
          >
            <Logo />
          </Typography>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            {Object.entries(pageGroup).map((arrStr, index) => (
              <Button
                key={index}
                sx={{ color: "#fff", fontSize: "1.5rem" }}
                onClick={() => handlePageMove(arrStr[1][0][arrStr[0]])}
              >
                {arrStr[0]}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
      <Box component="nav">
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
}
