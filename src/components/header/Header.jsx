import React, { useEffect, useState } from 'react';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
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
    ListItemText,
    Slide,
    ListItemAvatar,
    ListItemButton,
    Paper
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
import { ImageIcon, WorkflowIcon } from 'lucide-react';
import { POS_GET } from '../../website/service/ApiService';


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} timeout={{ enter: 250, exit: 150 }}
        easing={{ enter: 'ease-out', exit: 'ease-in' }}
        appear />;
});
const Header = () => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
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


    const [orders, setOrders] = useState([]);
    useEffect(() => {
        const res = POS_GET('v1/order');
        res.then((data) => {
            setOrders(data.data);
        });
    }, []);


    return (
        <>
            <div className='d-flex justify-content-between align-items-center w-100 py-2 px-3 ps-3'>
                <div className="start">
                    <Button variant='text' className='start gap-2' onClick={() => navigate('/')}>
                        <Avatar
                            alt='image'
                            src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1dxWcWXGNh_rO1UCfYKTy9TfPLwsTd6ilJw&s'
                        />
                        <p className='' style={{
                            color: StyleColors.appGrayText,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}>RS Shopping</p>
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
                    <div className="app-defualt-user d-flex start px-2">
                        <div style={{
                            width: 32,
                            height: 32,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'rgba(113, 113, 113, 0.2)',
                            borderRadius: '50%',
                            cursor: 'pointer'

                        }}
                            onClick={() => setIsLogoutDialogOpen(true)}
                        >
                            <NotificationsNoneIcon style={{ fontSize: 20, color: 'grey' }} />
                        </div>
                    </div>

                    <LanguageSwitcher />


                    <div className="app-defualt-user d-flex start px-2 py-1">
                        <Avatar
                            alt="Remy Sharp"
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1dxWcWXGNh_rO1UCfYKTy9TfPLwsTd6ilJw&s"
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
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1dxWcWXGNh_rO1UCfYKTy9TfPLwsTd6ilJw&s"
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

            <Dialog fullScreen open={isLogoutDialogOpen} onClose={() => setIsLogoutDialogOpen(false)} TransitionComponent={Transition} >
                <div className='h-full' style={{ backgroundColor: StyleColors.appBackground }}>
                    <div className='w-full flex justify-between items-center px-2'>
                        <div className="start">
                            <IconButton variant='text' className='start gap-2' onClick={() => navigate('/')}>
                                <Avatar
                                    alt='image'
                                    src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1dxWcWXGNh_rO1UCfYKTy9TfPLwsTd6ilJw&s'
                                />
                                <p style={{
                                    color: StyleColors.appGrayText,
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}>
                                    RS Shopping management system
                                </p>
                            </IconButton>
                        </div>
                        <Box>
                            <IconButton
                                edge="start"
                                color="inherit"
                                onClick={() => setIsLogoutDialogOpen(false)}
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
                    </div>

                    <div className='center mt-5'>
                        <List
                            sx={{ maxWidth: 1200, backgroundColor: StyleColors.appBackground }}>

                            {
                                orders.map((order, index) =>
                                    order.order_status_sate == null ?
                                        <ListItemButton className='bg-white mb-2'>
                                            <ListItemAvatar>
                                                <Paper className='center' sx={{ height: 120, width: 120, borderRadius: "50%", border: "2px solid rgb(37, 176, 74)", backgroundColor: "white", }}>
                                                    <Avatar sx={{ height: 100, width: 100, }} src='https://png.pngtree.com/png-clipart/20240709/original/pngtree-casual-man-flat-design-avatar-profile-picture-vector-png-image_15526568.png'>
                                                        <ImageIcon />
                                                    </Avatar>
                                                </Paper>
                                            </ListItemAvatar>
                                            <ListItemText className='ps-3' primary="Chan Dara" secondary='Thank you for your order! Since this is a larger request, it may take a bit more time to prepare. We appreciate your patience and will make sure everything is handled with care!"

Let me know if you want it to sound more formal, friendly, or specific to a product or service.' />
                                        </ListItemButton> : null
                                )
                            }



                        </List>
                    </div>

                </div>
            </Dialog>
        </>
    );
};

export default Header;