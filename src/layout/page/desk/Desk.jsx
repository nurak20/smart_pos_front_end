
import './desk.css'
const Desk = () => {
    return (
        <>
            <div className='desk'>
                <div className="row">
                    <div className="col-xl-3 col-md-4 col-sm-6 col-12 p-3">
                        <div className="desk-food pointer">
                            <div className="card-header between py-2">
                                <div className='start'>
                                    #0001
                                </div>
                                <div className='w-50 text-end'>
                                    <i class="fa-solid fa-user-group"></i> 6
                                </div>
                            </div>
                            <div className="d-block">
                                <div className="start ">
                                    <div className='font-12 px-3 text-secondary'>Desk number : </div>
                                    <div className='fs-3 fw-bold'> 36</div>
                                </div>
                                <div className="start ">
                                    <div className='font-12 px-3 text-secondary'>Total Pay : </div>
                                    <div className='fs-3 fw-bold'> 12.55$</div>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>
            </div>
        </>
    )
}

export default Desk
