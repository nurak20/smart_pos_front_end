import React from 'react'
import { Link } from 'react-router-dom'
import { Translate, StyleColors } from '../extension/Extension'
import { CiFacebook, CiInstagram, CiYoutube, CiMail, CiPhone, CiLock } from 'react-icons/ci'
import { SiTiktok } from 'react-icons/si'
import { FaTelegramPlane, FaExchangeAlt } from 'react-icons/fa'

const Footer = () => {
    const textStyle = { fontSize: StyleColors.fontMedium };

    const socialLinks = [
        { name: 'Facebook', icon: <CiFacebook /> },
        { name: 'Instagram', icon: <CiInstagram /> },
        { name: 'TikTok', icon: <SiTiktok /> },
        { name: 'Youtube', icon: <CiYoutube /> }
    ];

    const serviceLinks = [
        { text: Translate({ km: "គោលការណ៍ប្តូរទំនិញតាមអ៊ីនធឺណិត", en: "Online Exchange Policy", ch: "网上退换政策", th: "นโยบายแลกเปลี่ยนออนไลน์" }), icon: <FaExchangeAlt /> },
        { text: Translate({ km: "គោលការណ៍ភាពឯកជន", en: "Privacy Policy", ch: "隐私政策", th: "นโยบายความเป็นส่วนตัว" }), icon: <CiLock /> }
    ];

    const contactLinks = [
        { text: 'info@nurakkh.com', icon: <CiMail /> },
        { text: '(+885) 0889058825', icon: <CiPhone /> },
        { text: '(+885) 069609008', icon: <CiPhone /> },
        { text: 't.me/nurakkh20', icon: <FaTelegramPlane /> }
    ];

    return (
        <>
            <hr />
            <section
                className="container-fluid d-flex justify-content-center align-items-center p-3 mt-3"
                style={textStyle}
            >
                <div className="row">
                    {/* Follow Us Column */}
                    <div className="col-12 col-md-6 col-lg-3">
                        <h5 style={textStyle} className="py-3">
                            {Translate({ km: "តាមដានពួកយើង", en: "FOLLOW US", ch: "关注我们", th: "ติดตามเรา" })}
                        </h5>
                        <ul className="navbar-nav">
                            {socialLinks.map((link) => (
                                <li key={link.name} className="mb-1">
                                    <Link style={textStyle} className="nav-link text-hover-underline d-flex align-items-center">
                                        <span className="me-2">{link.icon}</span>
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Customer Service Column */}
                    <div className="col-12 col-md-6 col-lg-3">
                        <h5 style={textStyle} className="py-3 text-hover-underline">
                            {Translate({ km: "សេវាកម្មអតិថិជន", en: "CUSTOMER SERVICE", ch: "客户服务", th: "บริการลูกค้า" })}
                        </h5>
                        <ul className="navbar-nav">
                            {serviceLinks.map((link, idx) => (
                                <li key={idx} className="mb-1 d-flex align-items-center">
                                    <span style={textStyle} className="me-2 d-inline-block align-middle">
                                        {link.icon}
                                    </span>
                                    <span style={textStyle} className="text-hover-underline align-middle">
                                        {link.text}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Us Column */}
                    <div className="col-12 col-md-6 col-lg-3">
                        <h5 style={textStyle} className="py-3">
                            {Translate({ km: "ទាក់ទង​មក​ពួក​យើង", en: "CONTACT US", ch: "联系我们", th: "ติดต่อเรา" })}
                        </h5>
                        <ul className="navbar-nav">
                            {contactLinks.map((link, idx) => (
                                <li key={idx} className="mb-1 d-flex align-items-center">
                                    <span style={textStyle} className="me-2">{link.icon}</span>
                                    <span style={textStyle}>{link.text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* We Accept Column */}
                    <div className="col-12 col-md-6 col-lg-3">
                        <h5 style={textStyle} className="py-3">
                            {Translate({ km: "យើងទទួលស្គាល់", en: "WE ACCEPT", ch: "我们接受", th: "เรารับชำระเงิน" })}
                        </h5>
                        <img
                            src="https://zandokh.com/image/catalog/logo/web-footer/We-accept-payment%E2%80%93for-web-footer-1.png"
                            alt="Payment options"
                            className="img-fluid"
                            style={{ maxWidth: '100%' }}
                        />
                    </div>
                </div>
            </section>
        </>
    )
}

export default Footer
