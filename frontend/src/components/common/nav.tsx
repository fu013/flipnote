/* eslint-disable jsx-a11y/alt-text */
import { useState, MouseEvent } from "react";
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
import { pageGroup } from "config/pageSetting.config";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
import { getImgURL } from "lib/getImgURL";
import { useEffect } from "react";
import { useRecoilValue, useRecoilState } from "recoil";
import { accessTokenAtom, userInfoAtom } from "services/recoil/auth";
import { getCookie } from "services/utils/cookie";
import { useAuth_a } from "services/axios/auth.axios";
import { isLoggedInAtom } from "services/recoil/auth";
import customToast from "lib/customToast";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import Menu from "@mui/material/Menu";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
/* import { io } from 'socket.io-client';
import { SERVER_URL } from "config/constants.config";
const socket = io(SERVER_URL, {
  path: '/logActive'
});

socket.on('connect', () => {
  console.log('Connected to WebSocket server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from WebSocket server');
}); */


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
const profileSubMenu = ["프로필", "로그", "대쉬보드", "로그아웃"];

export default function Nav(props: Props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logIn, setLogIn] = useRecoilState(isLoggedInAtom);
  const user = useRecoilValue(userInfoAtom);
  const token = useRecoilValue(accessTokenAtom);
  const useAuthA = useAuth_a();
  const navigate = useNavigate();
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };
  const handlePageMove = (url: string) => {
    navigate(url);
  };

  useEffect(() => {
    if (getCookie("isAccess") >= 1 && user && token) setLogIn(true);
    else setLogIn(false);
  }, [setLogIn, user, token]);

  const Logo = () => {
    return (
      <LogoContainer>
        <LogoImage src={getImgURL("favicon.png")} />
        <LogoText>dailyMaple</LogoText>
      </LogoContainer>
    );
  };

  const handleLogout = () => {
    useAuthA.logout(user.mbId, () => {
      setLogIn(false);
      customToast("로그아웃 되었습니다", "success");
      navigate("/auth/login");
    });
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
            {!logIn ? ( // 비로그인
              <Button
                sx={{ color: "#fff", fontSize: "1.5rem" }}
                onClick={() => {
                  navigate("/auth/login");
                }}
              >
                Login
              </Button>
            ) : null}
          </Box>
          {logIn ? ( // 로그인
            <Box sx={{ flexGrow: 0, marginLeft: "1rem" }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="Remy Sharp" src={getImgURL("image034.png")} />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {profileSubMenu.map((subMenu, index) =>
                  subMenu === "로그아웃" ? (
                    <MenuItem
                      key={index}
                      onClick={() => {
                        handleLogout();
                        handleCloseUserMenu();
                      }}
                    >
                      <Typography align="center">{subMenu}</Typography>
                    </MenuItem>
                  ) : (
                    <MenuItem key={index} onClick={handleCloseUserMenu}>
                      <Typography align="center">{subMenu}</Typography>
                    </MenuItem>
                  )
                )}
              </Menu>
            </Box>
          ) : null}
          <DarkModeIcon
            style={{
              marginLeft: "1rem",
              cursor: "pointer",
              fontSize: "3rem",
              color: "yellow",
            }}
          />
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
