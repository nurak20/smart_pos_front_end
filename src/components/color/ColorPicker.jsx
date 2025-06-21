import React, { useState } from "react";
import { Modal, Button, Grid, Typography, Box } from "@mui/material";
import { ChromePicker } from "react-color";

const ColorPickerWithGridModal = ({ label, defaultColor, onColorChange }) => {
    const [color, setColor] = useState(defaultColor || "#000");
    const [isModalOpen, setIsModalOpen] = useState(false);

    // const presetColors = [
    "#FF5733", "#33FF57", "#3357FF", "#F1C40F", "#8E44AD", "#3498DB", "#1ABC9C", "#E74C3C", "#9B59B6", "#16A085",
        "#F39C12", "#D35400", "#2980B9", "#2C3E50", "#27AE60", "#C0392B", "#7F8C8D", "#F7DC6F", "#D5DBDB", "#AAB7B8",
        "#FF6F61", "#6A5ACD", "#FFD700", "#00FF7F", "#FF1493", "#4B0082", "#FF4500", "#DA70D6", "#40E0D0", "#F0E68C",
        "#FFF8DC", "#FF6347", "#32CD32", "#F08080", "#98FB98", "#ADD8E6", "#E0FFFF", "#D3D3D3", "#A52A2A", "#C71585",
        "#800080", "#FF8C00", "#B22222", "#FFFF00", "#FF00FF", "#800000", "#808000", "#808080", "#C0C0C0", "#000080",
        "#F5F5DC", "#C8A2C8", "#00BFFF", "#7FFFD4", "#FF7F50", "#D2691E", "#CD5C5C", "#FFDAB9", "#FFB6C1", "#D8BFD8",
        "#ADFF2F", "#FFE4B5", "#8A2BE2", "#7FFF00", "#8B0000", "#A52A2A", "#C6E2FF", "#6B8E23", "#FF00FF", "#DDA0DD",
        "#E6E6FA", "#F0FFF0", "#FFE4C4", "#B0C4DE", "#F5DEB3", "#BDB76B", "#FFB6C1", "#FF8C00", "#D3D3D3", "#A9A9A9",
        "#A2B5CD", "#F0F8FF", "#F4A300", "#FFFFF0", "#C71585", "#8B0000", "#C0C0C0", "#E9C1D3", "#D2691E", "#A52A2A",
        "#B4EEB4", "#008080", "#20B2AA", "#2F4F4F", "#FF7F50", "#F0FFF0", "#98FB98", "#D3D3D3", "#A52A2A", "#B0C4DE"
    // ];

    const [presetColors, setColors] = useState([
        '#212529', // Gray
        '#18191A', // Dark Gray
        '#141414', // Black
        '#343A40', // Darker Gray
        '#282C34', // Deep Gray
        '#37414E', // Bluish Gray
        '#404852', // Steel Gray
        '#505963', // Slate Gray
        '#606C7B', // Charcoal Gray
        '#707B8C', // Dark Slate Gray
        '#80899C', // Dim Gray
        '#9099A2', // Grayish Brown
        '#A0A9B2', // Light Gray
        '#B0B9C2', // Silver
        '#C0C9D2', // Gainsboro
        '#D0D9E2', // Light Steel Blue
        '#E0E9F2', // Light Blue
        '#F0F9FF', // Azure
        '#000080', // Navy
        '#0000FF', // Blue
        '#008000', // Green
        '#00FF00', // Lime
        '#800000', // Maroon
        '#FF0000', // Red
        '#800080', // Purple
        '#FF00FF', // Magenta
        '#FFFF00', // Yellow
        '#00FFFF', // Cyan
        '#A52A2A', // Brown
        '#FFA07A', // Light Salmon
        '#20B2AA', // Light Sea Green
        '#FFA500', // Orange
        '#FFC0CB', // Pink
        '#8B0000', // Dark Red
        '#008080', // Teal
        '#4B0082', // Indigo
        '#800080', // Purple
        '#808080', // Gray
        '#C0C0C0', // Silver
        '#FFFFF0', // Ivory
        '#F0FFF0', // Honeydew
        '#F5F5DC', // Beige
        '#FFE4C4', // Bisque
        '#FFDEAD', // Nougat
        '#F0E68C', // Khaki
        '#BDB76B', // Dark Khaki
        '#5F9EA0', // Cadet Blue
        '#7FFFD4', // Aquamarine
        '#40E0D0', // Turquoise
        '#00FFFF', // Cyan
        '#008080', // Teal
        '#483D8B', // Dark Slate Blue
        '#6A5ACD', // Slate Blue
        '#708090', // Slate Gray
        '#778899', // Light Slate Gray
        '#B0C4DE', // Powder Blue
        '#ADD8E6', // Light Blue
        '#87CEEB', // Sky Blue
        '#00BFFF', // Deep Sky Blue
        '#1E90FF', // Dodger Blue
        '#4169E1', // Royal Blue
        '#00008B', // Dark Blue
        '#0000CD', // Medium Blue
        '#191970', // Midnight Blue
        '#FF1493', // Deep Pink
        '#DB7093', // Pale Pink
        '#FFA07A', // Light Salmon
        '#F08080', // Light Coral
        '#CD5C5C', // Indian Red
        '#DC143C', // Crimson
        '#FF0000', // Red
        '#B22222', // Firebrick
        '#8B0000', // Dark Red
        '#8A2BE2', // Blue Violet
        '#9400D3', // Dark Violet
        '#9932CC', // Dark Orchid
        '#BA55D3', // Orchid
        '#FFC0CB', // Pink
        '#DA70D6', // Orchid
        '#EE82EE', // Violet
        '#DDA0DD', // Plum
        '#FFB6C1', // Light Pink
        '#FF69B4', // Hot Pink
        '#FF1493', // Deep Pink
        '#C71585', // Medium Violet Red
        '#DB7093', // Pale Pink
        '#FFA07A', // Light Salmon
        '#F08080', // Light Coral
        '#CD5C5C', // Indian Red
        '#DC143C', // Crimson
        '#FF0000', // Red
        '#B22222', // Firebrick
        '#8B0000', // Dark Red

        "#A2B5CD", "#F0F8FF", "#F4A300", "#FFFFF0", "#C71585", "#8B0000", "#C0C0C0", "#E9C1D3", "#D2691E", "#A52A2A",
        "#B4EEB4", "#008080", "#20B2AA", "#2F4F4F", "#FF7F50", "#F0FFF0", "#98FB98", "#D3D3D3", "#A52A2A", "#B0C4DE"
    ]);

    //     "#FF5733", // Orange-Red
    //     "#33FF57", // Green
    //     "#3357FF", // Blue
    //     "#8E44AD", // Purple
    //     "#3498DB", // Sky Blue
    //     "#1ABC9C", // Teal
    //     "#E74C3C", // Red
    //     "#9B59B6", // Violet
    //     "#F39C12", // Amber
    //     "#D35400", // Orange
    //     "#2980B9", // Light Blue
    //     "#2C3E50", // Dark Blue
    //     "#C0392B", // Dark Red
    //     "#7F8C8D", // Gray
    //     "#6A5ACD", // Slate Blue
    //     "#FFD700", // Gold
    //     "#FF1493", // Deep Pink
    //     "#FF4500", // Orange Red
    //     "#DA70D6", // Orchid
    //     "#40E0D0", // Turquoise
    //     "#F0E68C", // Khaki
    //     "#FF6347", // Tomato
    //     "#32CD32", // Lime Green
    //     "#FF8C00", // Dark Orange
    //     "#B22222", // Firebrick
    //     "#800080", // Purple
    //     "#FF00FF", // Magenta
    //     "#808000", // Olive
    //     "#C0C0C0", // Silver
    //     "#000080", // Navy Blue
    //     "#A52A2A", // Brown
    //     "#8B0000", // Dark Red
    //     "#D2691E", // Chocolate
    //     "#B4EEB4", // Pale Green
    //     "#F0F8FF", // Alice Blue
    //     "#C8A2C8", // Lilac
    //     "#00BFFF", // Deep Sky Blue
    //     "#FF7F50", // Coral
    //     "#7FFFD4", // Aquamarine
    //     "#D8BFD8", // Thistle
    //     "#8A2BE2", // Blue Violet
    //     "#7FFF00", // Chartreuse
    //     "#F0FFF0", // Honeydew
    //     "#FFE4B5", // Moccasin
    //     "#ADFF2F", // Green Yellow
    //     "#E6E6FA", // Lavender
    //     "#F5F5DC", // Beige
    //     "#F5DEB3", // Wheat
    //     "#B0C4DE", // Light Steel Blue
    //     "#A9A9A9", // Dark Gray
    //     "#F4A300", // Orange
    //     "#DDA0DD", // Plum
    //     "#BDB76B", // Dark Khaki
    //     "#A2B5CD", // Light Steel Blue
    //     "#C71585", // Medium Violet Red
    //     "#8B0000", // Dark Red
    //     "#E9C1D3", // Pale Pink
    //     "#A52A2A", // Brown
    //     "#008080", // Teal
    //     "#20B2AA", // Light Sea Green
    //     "#2F4F4F", // Dark Slate Gray
    //     "#6B8E23", // Olive Drab
    //     "#D2691E", // Chocolate
    // ];


    const handleColorChange = (color) => {
        setColor(color.hex);
        if (onColorChange) {
            onColorChange(color.hex);
        }
    };

    const handleGridColorSelect = (color) => {
        setColor(color);
        if (onColorChange) {
            onColorChange(color);
        }
        setIsModalOpen(false); // Close modal after selection
    };

    return (
        <div style={{ margin: "10px 0", textAlign: "center" }}>
            {label && <Typography variant="h6" gutterBottom>{label}</Typography>}

            {/* Button to open modal */}
            <Button
                variant="contained"
                color="primary"
                onClick={() => setIsModalOpen(true)}
                style={{
                    marginBottom: "20px",
                    textTransform: "none",
                }}
            >
                Select Color
            </Button>

            {/* Material UI Modal for color selection */}
            <Modal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                aria-labelledby="color-selection-modal"
                aria-describedby="color-selection-modal-description"
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        bgcolor: "background.paper",
                        borderRadius: "8px",
                        boxShadow: 24,
                        p: 4,
                        width: "80%",
                        maxWidth: "600px",
                        overflowY: "auto",
                    }}
                >
                    <Typography variant="h6" gutterBottom>
                        Select Your Color
                    </Typography>

                    {/* Grid of 100 colors */}
                    <Grid
                        container
                        spacing={1}
                        sx={{
                            display: "grid",
                            gridTemplateColumns: "repeat(10, 40px)",
                            gap: "10px",
                            justifyContent: "center",
                            marginBottom: "20px",
                        }}
                    >
                        {presetColors.map((presetColor, index) => (
                            <Grid item key={index}>
                                <Box
                                    sx={{
                                        width: "40px",
                                        height: "40px",
                                        backgroundColor: presetColor,
                                        borderRadius: "5px",
                                        cursor: "pointer",
                                        border: color === presetColor ? "3px solid #000" : "none",
                                        transition: "transform 0.2s",
                                        "&:hover": {
                                            transform: "scale(1.1)",
                                        },
                                    }}
                                    onClick={() => handleGridColorSelect(presetColor)}
                                />
                            </Grid>
                        ))}
                    </Grid>

                    {/* Chrome Color Picker */}
                    <ChromePicker color={color} onChangeComplete={handleColorChange} />

                    <Box sx={{ marginTop: "20px", display: "flex", justifyContent: "center" }}>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => setIsModalOpen(false)}
                            style={{
                                textTransform: "none",
                            }}
                        >
                            Close
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
};

export default ColorPickerWithGridModal;
