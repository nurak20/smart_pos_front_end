import React, { useState } from 'react';
import {
    Button,
    Avatar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Typography,
    Box,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText
} from '@mui/material';
import {
    IoChatbubbleEllipsesOutline,
    IoPersonOutline,
    IoSettingsOutline,
    IoHelpCircleOutline,
    IoLogOutOutline,
    IoCloseOutline
} from 'react-icons/io5';
import { StyleColors } from '../../website/extension/Extension';
import LanguageSwitcher from '../../website/languages/LanguageSwitcher';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../layout/auth/AuthContext';

const Header = () => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const { logout } = useAuth();

    const handleAvatarClick = () => {
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };
    const navigate = useNavigate();
    const { user } = useAuth();
    console.log(user);

    const menuItems = [
        { icon: <IoPersonOutline size={24} />, text: 'Profile', action: () => console.log('Profile clicked') },
        { icon: <IoSettingsOutline size={24} />, text: 'Settings', action: () => console.log('Settings clicked') },
        { icon: <IoHelpCircleOutline size={24} />, text: 'Help & Support', action: () => console.log('Help clicked') },
        { icon: <IoLogOutOutline size={24} />, text: 'Logout', action: () => logout() },
    ];

    return (
        <>
            <div className='d-flex justify-content-between align-items-center w-100 py-2 px-3 ps-3'>
                <div className="start">
                    <Button variant='text' className='start gap-2' onClick={() => navigate('/')}>
                        <Avatar
                            alt='image'
                            src='data:image/jpeg;base64,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xLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRGJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLfRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjxLGRJjlb/2Q=='
                        />
                        <p className='truncate' style={{ color: StyleColors.appGrayText }}>RS Shopping management system </p>
                    </Button>
                </div>

                <div className='end'>
                    {/* <div className='fs-4 d-flex'>
                        <div className="position-relative fs-4 mx-3">
                            <IoChatbubbleEllipsesOutline size={28} />
                            <span className="position-absolute top-0 start-100 translate-middle f-14 text-danger">
                                99+
                                <span className="visually-hidden">unread messages</span>
                            </span>
                        </div>
                    </div> */}

                    <LanguageSwitcher />

                    <div className="app-defualt-user d-flex start px-2 py-1">
                        <Avatar
                            alt="Remy Sharp"
                            src="https://gratisography.com/wp-content/uploads/2024/11/gratisography-augmented-reality-800x525.jpg"
                            sx={{ width: 32, height: 32, cursor: 'pointer' }}
                            onClick={handleAvatarClick}
                        />
                    </div>
                </div>
            </div>

            {/* Full Screen Dialog */}
            <Dialog
                fullScreen
                open={dialogOpen}
                onClose={handleCloseDialog}
                sx={{
                    '& .MuiDialog-paper': {
                        background: StyleColors.appBackground,
                        color: 'white'
                    }
                }}
            >
                {/* Close Button */}
                <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1 }}>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleCloseDialog}
                        aria-label="close"
                        sx={{
                            color: 'white',
                            backgroundColor: 'rgba(75, 10, 44, 0.2)',
                            '&:hover': {
                                backgroundColor: 'rgba(75, 10, 44, 0.5)',
                            }
                        }}
                    >
                        <IoCloseOutline size={24} />
                    </IconButton>
                </Box>

                <DialogContent sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh',
                    textAlign: 'center',
                    padding: 4
                }}>
                    {/* User Avatar */}
                    <Avatar
                        src="https://gratisography.com/wp-content/uploads/2024/11/gratisography-augmented-reality-800x525.jpg"
                        alt="User Profile"
                        sx={{
                            width: 120,
                            height: 120,
                            marginBottom: 3,
                            border: '4px solid rgba(255, 255, 255, 0.3)',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                        }}
                    />

                    {/* User Info */}
                    <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: 1, color: StyleColors.componentsColor }}>
                        {user?.username}
                    </Typography>
                    <Typography variant="h6" sx={{ opacity: 0.8, marginBottom: 1, color: StyleColors.componentsColor }}>
                        Administrator
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.7, marginBottom: 4, color: StyleColors.componentsColor }}>
                        {user?.email}
                    </Typography>

                    <Divider sx={{ width: '100%', maxWidth: 400, marginBottom: 3, backgroundColor: 'rgba(255, 255, 255, 0.3)' }} />

                    {/* Menu Items */}
                    <Box sx={{ width: '100%', maxWidth: 400 }}>
                        <List>
                            {menuItems.map((item, index) => (
                                <ListItem
                                    key={index}
                                    button
                                    onClick={() => {
                                        item.action();
                                        handleCloseDialog();
                                    }}
                                    sx={{
                                        cursor: 'pointer',
                                        borderRadius: 2,
                                        marginBottom: 1,
                                        backgroundColor: 'rgba(102, 14, 58, 0.05)',
                                        '&:hover': {
                                            backgroundColor: 'rgba(102, 14, 58, 0.2)',
                                        },
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    <ListItemIcon sx={{ color: StyleColors.componentsColor, minWidth: 40 }}>
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText
                                        sx={{ color: StyleColors.componentsColor }}
                                        primary={item.text}
                                        primaryTypographyProps={{
                                            fontSize: '1.1rem',
                                            fontWeight: 500
                                        }}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Box>

                    {/* Footer Info */}
                    <Box sx={{ marginTop: 4, opacity: 0.6 }}>
                        <Typography variant="body2" sx={{ color: StyleColors.componentsColor }}>
                            Last login: Today at 9:30 AM
                        </Typography>
                        <Typography variant="body2" sx={{ color: StyleColors.componentsColor }}>
                            Version 1.2.3
                        </Typography>
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default Header;