import { useState,useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getAllBrans } from '../../../api/Bran'
const Company = () => {
    const [myBran , setMyBran] = useState([])
    useEffect(() => {
        getAllBrans().then((respone) => {
            setMyBran(respone.data)
        }).catch(error => {
            console.error(error)
        })
    },[])
    const goToCompany = (id) => {
        window.localStorage.setItem('item' ,-1)
        window.localStorage.setItem('bran' , id)
    }
  return (
    <>
        <section className='container-fluid' data-bs-dismiss="modal">
            <div className="container">
                <div className="row">
                    {
                        myBran.map(bran =>
                            <div className="col-md-4">
                                <a href='/product' className="nav-link border-0" onClick={() => goToCompany(bran.id)}>
                                    <div className="card border-top">
                                        <div className="company-card align-items-center d-flex p-3">
                                            <img src={bran.url} alt="" className=" img-fluid" />
                                        </div>
                                        
                                        <div className="card-body border">
                                            <p className="card-title">{bran.branName}</p>
                                            <p className="card-text text-hover-underline">{bran.description}</p>
                                        </div>
                                    </div>
                                </a>
                            </div>
                            )
                    }
                </div>
            </div>
        </section>
    </>
  )
}

export default Company
