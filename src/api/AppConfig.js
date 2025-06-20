import { decryptData } from "../cryptoJs/Crypto";
import Cookies from "js-cookie";
import { getEmployee } from "./EmployeeApi";
import { jwtDecode } from "jwt-decode";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";
import { motion } from "framer-motion";


const secretkey = "kans983(*93849Jnjsbd@*^@knskldn&^@($*LLjbHHSDuBKJ_)93849uIHUSHD&#%#&^$(@80928()*&*#$&(*";


export const getDefualtUserId = () => {
    try {
        const dataEncrypt = Cookies.get("user-data");
        if (dataEncrypt) {
            const userData = decryptData(dataEncrypt, secretkey);
            console.log(userData);
            if (userData.data.id)
                return userData.data.id;
            else
                return 0;
        }
    } catch (e) {
        Cookies.remove("user-data");
        window.location.reload();
        return 0;
    }
}
export const verifyToken = (token) => {
    try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Current time in seconds

        // Check if the token has expired
        if (decoded.exp && decoded.exp < currentTime) {
            console.warn("Token has expired.");
            return false;
        }
        console.log("Token is valid.");
        return true;
    } catch (error) {
        console.error("Invalid token:", error.message);
        return false;
    }
};

export const getToken = () => {
    try {
        const dataEncrypt = Cookies.get("user-data");
        if (dataEncrypt) {
            const userData = decryptData(dataEncrypt, secretkey);

            if (userData.token) {
                if (verifyToken(userData.token)) {
                    return userData.token; // Return valid token
                } else {
                    // Token is invalid or expired
                    Cookies.remove("user-data");
                    window.location.href = "/"; // Redirect to login
                    return '';
                }
            } else {
                Cookies.remove("user-data");
                window.location.href = "/";
                return '';
            }
        }
    } catch (e) {
        console.error("Error retrieving token:", e.message);
        return '';
    }
};


export const userObject = () => {
    try {
        const dataEncrypt = Cookies.get("user-data");
        if (dataEncrypt) {
            const userData = decryptData(dataEncrypt, secretkey);

            if (userData.data) {
                const obj = {
                    "userName": userData.data.firstName + ' ' + userData.data.lastName,
                    "image": userData.data.image,
                    "role": userData.role,
                    "branch": userData.data.companyID,
                    "branchName": userData.branchName
                }
                return obj;


            } else {
                return {
                    "userName": "No Username",
                    "image": '',
                    "role": userData.role,
                    "branch": 0,
                }
            }
        }
    } catch (e) {
        Cookies.remove("user-data");
        window.location.reload();
        return '';
    }
}



// 2 number is POS
// 1 number is admin or manager
// 3 login again

export const checkingTypeOfUser = () => {
    try {
        const dataEncrypt = Cookies.get("user-data");
        if (dataEncrypt) {
            const userData = decryptData(dataEncrypt, secretkey);

            if (userData) {
                if (userData.role == "SELLER") {
                    return 2;
                } else if (userData.role == "ADMIN" || userData.role == "MANAGER") {
                    try {
                        const admin_viewer = Cookies.get('admin_viewer');
                        if (admin_viewer) {
                            if (admin_viewer == 1) {
                                return 1;
                            } else if (admin_viewer == 2) {
                                return 2;
                            } else {
                                return 1;
                            }
                        } else {
                            return 1;
                        }

                    } catch (error) {
                        return 1;
                    }

                } else {
                    return 3;
                }

            }
        } else {
            return 3;
        }

    } catch (error) {
        return 3;
    }
}


// // Function to export data to Excel
// export const exportToExcel = (data, fileName = "ExportedData") => {
//     const ws = XLSX.utils.json_to_sheet(data);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
//     XLSX.writeFile(wb, `${fileName}.xlsx`);
// };

// // Function to print/export data as a PDF
// export const printPage = (data, columns, fileName = "ExportedData") => {
//     const doc = new jsPDF();
//     autoTable(doc, {
//         head: [columns.map(col => col.label)],
//         body: data.map(item => columns.map(col => item[col.key])),
//     });
//     doc.save(`${fileName}.pdf`);
// };

export const exportToExcelFiles = (data, fileName = "ExportedData") => {
    if (!data || data.length === 0) {
        console.error("No data available to export.");
        return;
    }
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, `${fileName}.xlsx`);
};



/**
 * Prints a PDF of a specific screen element with a header, footer, author, and date.
 * @param {string} elementId - The ID of the HTML element to capture.
 * @param {string} fileName - The name of the exported PDF file.
 * @param {string} author - The name of the author of the report.
 * @param {string} title - The title of the report.
 */
export const printDoc = async (elementId, fileName = "ScreenExport", author, title) => {
    const element = document.getElementById(elementId);

    if (!element) {
        console.error("Element not found");
        return;
    }

    try {
        // Capture the element as an image
        const canvas = await html2canvas(element);
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");

        // Define page dimensions
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        // Calculate image dimensions
        const imgWidth = 200; // Image width to fit within A4 margins
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // Calculate centered position for the image
        const marginLeft = (pageWidth - imgWidth) / 2;
        const marginTop = 10; // Top margin for the image

        // Add the screenshot image of the content
        pdf.addImage(imgData, "PNG", marginLeft, marginTop, imgWidth, imgHeight);

        // Save the PDF
        pdf.save(`${fileName}.pdf`);
    } catch (error) {
        console.error("Error generating PDF:", error);
    }
};


/**
 * A dynamic search function that filters data based on a search term.
 * @param {Array} data - The array of data to search through.
 * @param {string} searchTerm - The search term to filter the data.
 * @param {Array} fields - The fields of the data objects to search in.
 * @returns {Array} - Filtered array of data.
 */
export const searchData = (data, searchTerm, fields = []) => {
    if (!searchTerm) return data;  // If no search term, return all data.

    // Convert the search term to lowercase for case-insensitive comparison
    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    return data.filter(item => {
        // Check if any of the fields in the item contain the search term
        return fields.some(field => {
            const value = item[field];
            // Ensure the value is a string, then check if it includes the search term
            return value && value.toString().toLowerCase().includes(lowerCaseSearchTerm);
        });
    });
};

export const perPage = () => [
    {
        key: 1,
        value: 10,
        text: 'Item'
    },
    {
        key: 1,
        value: 15,
        text: 'Item'
    },
    {
        key: 1,
        value: 20,
        text: 'Item'
    },
    {
        key: 1,
        value: 30,
        text: 'Item'
    },
]

// animated row table
export const globleRowVariants = {
    hidden: { opacity: 0, Y: 10 },
    visible: (index) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: index * 0.06,
            duration: 0.5,
            ease: 'easeOut',
        },
    }),
};


// animated card
export const globleCardVariants = {
    hidden: { opacity: 0, Y: 10 },
    visible: (index) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: index * 0.06,
            duration: 0.5,
            ease: 'easeOut',
        },
    }),
};


