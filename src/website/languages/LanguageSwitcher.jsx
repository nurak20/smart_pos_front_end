import React, { useContext, useEffect, useState } from "react";
import { LanguageContext } from "../provider/Provider";
import { HiLanguage } from "react-icons/hi2";
import { set } from "date-fns";
import { StyleColors } from "../extension/Extension";


const LanguageSwitcher = ({ isShowBorder = false }) => {
    const [seletedLaunguage, setSelectedLanguage] = useState();
    const languages = [
        { code: "en", name: "English", flag: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Flag_of_the_United_Kingdom_%281-2%29.svg/1200px-Flag_of_the_United_Kingdom_%281-2%29.svg.png' }, // UK flag (commonly used for English)
        { code: "km", name: "ភាសាខ្មែរ", flag: 'https://media.istockphoto.com/id/675303834/vector/official-vector-flag-of-the-kingdom-of-cambodia.jpg?s=612x612&w=0&k=20&c=4UcTEsWxjSiv8PEo4E0DZesrZvjbVBZlFJzXci88EsI=' }, // Cambodia flag
        // Thailand flag
    ];
    const { changeLanguage } = useContext(LanguageContext);
    useEffect(() => {

        try {
            const storedLanguage = localStorage.getItem("selectedLanguage");
            console.log("Stored language:", storedLanguage);
            if (storedLanguage) {

                setSelectedLanguage(storedLanguage);
            } else {
                setSelectedLanguage(languages[0].flag);
            }
        } catch (error) {
            console.error("Error retrieving stored language:", error);
        }
    }, []);

    return (
        <>
            <div className="dropdown">
                <div className="pos-navbar-action-item overflow-hidden" type="button"
                    id="languageDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false" style={{ height: '25px', width: '25px', background: StyleColors.componentsLightColor, borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', border: isShowBorder ? '1px solid #ccc' : 'none' }}>
                    {seletedLaunguage ? <img src={seletedLaunguage} alt="" className="h-100" /> : <HiLanguage />}
                </div>



                <ul className="dropdown-menu border-0 shadow-sm" style={{ background: StyleColors.appBackground, fontSize: '18px' }} aria-labelledby="languageDropdown">
                    {languages.map((lang) => (
                        <li key={lang.code}>
                            <button
                                className="dropdown-item"
                                style={{ color: StyleColors.appDarkText }}
                                onClick={() => {
                                    setSelectedLanguage(lang.flag);
                                    changeLanguage(lang.code);
                                }}
                            >

                                <div className="start gap-2">
                                    <div style={{ width: '30px', height: '20px' }}>
                                        <img src={lang.flag} alt="" className="w-100 h-100" />
                                    </div>
                                    <div>
                                        {lang.name}
                                    </div>

                                </div>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </>

    );
};

export default LanguageSwitcher;