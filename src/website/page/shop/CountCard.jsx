import { useContext ,createContext, useState } from "react";

const MyCountContext = createContext()
const UpdateCount = createContext()
const DeleteCount = createContext()
export function useCount () {
    return useContext(MyCountContext)
}
export function useUpdateCount() {
    return useContext(UpdateCount)
}
export function useDeleteCount () {
    return useContext(DeleteCount)
}

export function ContextProvider({children}){
    const lenghtCard = window.localStorage.getItem('count')
    const [count , setCount] = useState(JSON.parse(lenghtCard))
    const CounterCard = () => {
        setCount(count+1)
    }
    const MinusCard = () => {
        setCount(count-1)
    }
    return (
        <MyCountContext.Provider value={count}>
            <UpdateCount.Provider value={CounterCard}>
                <DeleteCount.Provider value={MinusCard}>
                    {children}
                </DeleteCount.Provider>             
            </UpdateCount.Provider>         
        </MyCountContext.Provider>
    )
}