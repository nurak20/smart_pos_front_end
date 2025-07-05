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
import DoneIcon from '@mui/icons-material/Done';
import {
    IoChatbubbleEllipsesOutline,
    IoPersonOutline,
    IoSettingsOutline,
    IoHelpCircleOutline,
    IoLogOutOutline,
    IoCloseOutline,
    IoKey
} from 'react-icons/io5';
import { StyleColors } from '../../website/extension/Extension';
import LanguageSwitcher from '../../website/languages/LanguageSwitcher';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../layout/auth/AuthContext';
import { ImageIcon, WorkflowIcon } from 'lucide-react';
import { POS_GET } from '../../website/service/ApiService';
import EditUserProfile from '../../layout/profile/EditUserProfile';
import { FullscreenButton } from './ButtonFullScreen';


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
    const menuItems = [
        { icon: <IoPersonOutline size={24} />, text: 'Edit Profile', action: () => setIsLogoutDialogOpen(true) },
        { icon: <IoKey size={24} />, text: 'Change Password', action: () => null },
        { icon: <IoLogOutOutline size={24} />, text: 'Logout', action: () => logout() },
    ];


    const [orders, setOrders] = useState([]);
    useEffect(() => {
        const res = POS_GET('v1/order');
        res.then((data) => {
            setOrders(data.data);
        });
    }, []);
    const userData = {
        first_name: user.first_name,
        last_name: user.last_name,
        image_url: user.image_url
    };

    var elem = document.getElementById("myvideo");
    function openFullscreen() {
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) { /* Safari */
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { /* IE11 */
            elem.msRequestFullscreen();
        }
    }


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
                    {/* <div className="app-defualt-user d-flex start px-2">
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
                    </div> */}
                    <LanguageSwitcher />



                    <div className="app-defualt-user d-flex start px-2 py-1">
                        <Avatar
                            alt="Remy Sharp"
                            src={user?.image_url}
                            sx={{ width: 25, height: 25, cursor: 'pointer' }}
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
                <div className='flex justify-content-between align-items-center gap-2 w-100 p-2'>
                    <div className="">
                        <Button variant='text' className='gap-2' onClick={() => setIsLogoutDialogOpen(false)}>
                            <Avatar
                                alt='image'
                                src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1dxWcWXGNh_rO1UCfYKTy9TfPLwsTd6ilJw&s'
                            />
                            <p className='text-sm' style={{ textTransform: 'capitalize', color: StyleColors.componentsColor, fontWeight: '400' }}>
                                RS Shopping management system
                            </p>
                        </Button>
                    </div>
                    <div>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleCloseDialog}
                            aria-label="close"
                            sx={{
                                color: StyleColors.componentsColor,
                            }}
                        >
                            <IoCloseOutline size={24} />
                        </IconButton>
                    </div>
                </div>

                <DialogContent sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',

                    textAlign: 'center',
                    padding: 4
                }}>
                    {/* User Avatar */}
                    <Avatar
                        src={user?.image_url}
                        alt="User Profile"
                        sx={{
                            width: 200,
                            height: 200,
                            marginBottom: 3,
                            border: '4px solid rgba(255, 255, 255, 0.3)',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                        }}
                    />

                    {/* User Info */}
                    <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: 1, color: StyleColors.componentsColor }}>
                        {user?.first_name} {user?.last_name}
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
                <div className='w-full h-full' style={{ backgroundColor: StyleColors.appBackground }}>
                    <div className='w-full flex justify-between items-center px-2' style={{ backgroundColor: StyleColors.appBackground }}>
                        <div className="flex gap-2">
                            <Button variant='text' className='gap-2' onClick={() => setIsLogoutDialogOpen(false)}>
                                <Avatar
                                    alt='image'
                                    src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1dxWcWXGNh_rO1UCfYKTy9TfPLwsTd6ilJw&s'
                                />
                                <p className='text-sm' style={{ textTransform: 'capitalize', color: StyleColors.componentsColor, fontWeight: '400' }}>
                                    RS Shopping management system
                                </p>
                            </Button>
                        </div>
                        <Box>
                            <IconButton
                                edge="start"
                                color="inherit"
                                onClick={() => setIsLogoutDialogOpen(false)}
                                aria-label="close"
                                sx={{
                                    color: StyleColors.componentsColor,
                                    transition: 'all 0.5s ease',
                                }}
                            >
                                <IoCloseOutline size={24} />
                            </IconButton>
                        </Box>
                    </div>
                    <EditUserProfile userData={userData} onSuccess={() => setIsLogoutDialogOpen(false)} onCancel={() => setIsLogoutDialogOpen(false)} />
                </div>
            </Dialog>
        </>
    );
};

export default Header;