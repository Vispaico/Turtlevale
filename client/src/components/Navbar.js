import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
  Select,
  FormControl,
  InputLabel,
} from '@material-ui/core';
import { Menu as MenuIcon, AccountCircle } from '@material-ui/icons';
import { useNavigate, Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { useTranslation } from 'react-i18next';
import { auth } from '../firebase';

const Navbar = ({ user }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { t, i18n } = useTranslation();
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleLanguageChange = (event) => {
    const newLanguage = event.target.value;
    i18n.changeLanguage(newLanguage);
    localStorage.setItem('turtlevale-language', newLanguage);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'pt', name: 'Português' },
    { code: 'de', name: 'Deutsch' },
    { code: 'it', name: 'Italiano' },
    { code: 'fr', name: 'Français' },
  ];

  const menuItems = [
    { path: '/', label: t('nav.home') },
    { path: '/signals', label: t('nav.signals'), authRequired: true },
    { path: '/trades', label: t('nav.trades'), authRequired: true },
    { path: '/portfolio/all-markets', label: t('nav.portfolio'), authRequired: true },
    { path: '/subscription', label: t('nav.subscription'), authRequired: true },
    { path: '/settings', label: t('nav.settings'), authRequired: true },
  ];

  const renderDesktopMenu = () => (
    <>
      {menuItems.map((item) => (
        (!item.authRequired || user) && (
          <Button
            key={item.path}
            color="inherit"
            component={Link}
            to={item.path}
            sx={{ margin: '0 8px' }}
          >
            {item.label}
          </Button>
        )
      ))}
    </>
  );

  const renderMobileMenu = () => (
    <Menu
      anchorEl={mobileMenuAnchor}
      open={Boolean(mobileMenuAnchor)}
      onClose={handleMobileMenuClose}
    >
      {menuItems.map((item) => (
        (!item.authRequired || user) && (
          <MenuItem
            key={item.path}
            onClick={() => {
              navigate(item.path);
              handleMobileMenuClose();
            }}
          >
            {item.label}
          </MenuItem>
        )
      ))}
    </Menu>
  );

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
            Turtlevale
          </Link>
        </Typography>

        {/* Language Selector */}
        <FormControl variant="outlined" size="small" sx={{ marginRight: 2, minWidth: 120 }}>
          <Select
            value={i18n.language}
            onChange={handleLanguageChange}
            displayEmpty
            style={{ color: 'white' }}
            className="language-selector"
          >
            {languages.map((lang) => (
              <MenuItem key={lang.code} value={lang.code}>
                {lang.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Desktop Menu */}
        {!isMobile && renderDesktopMenu()}

        {/* Mobile Menu Button */}
        {isMobile && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleMobileMenuOpen}
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* Auth Buttons */}
        {user ? (
          <div>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>
                <Typography>{user.email}</Typography>
              </MenuItem>
              <MenuItem onClick={() => { navigate('/settings'); handleClose(); }}>
                {t('nav.settings')}
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                {t('nav.logout')}
              </MenuItem>
            </Menu>
          </div>
        ) : (
          <div>
            <Button color="inherit" component={Link} to="/login">
              {t('nav.login')}
            </Button>
            <Button color="inherit" component={Link} to="/signup">
              {t('nav.signup')}
            </Button>
          </div>
        )}

        {renderMobileMenu()}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 