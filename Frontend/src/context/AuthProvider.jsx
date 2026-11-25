import React, { Children, useCallback, useEffect, useMemo, useState } from 'react'
import { AuthContext } from './AuthContext'
import API from '../api/axios'

export  const AuthProvider = ({Children}) => {

const [user,setUser]=useState(null)

// only *loading if there is a token that need verify 
const [loading,setLoading]=useState(()=>Boolean(localStorage.getItem("token")))
 
const logout=useCallback(()=>{
    localStorage.removeItem("token")
    setUser(null)
})

// 1.verify token with backend on app start /page refresh 

useEffect(()=>{
    const token=localStorage.getItem("token")
    if(!token) return

let cancelled=false

API.get("auth/me")
.then(({data})=>{
    if(!cancelled) setUser(data.user)
        })
 .catch((error)=>{
    // only drop the token if the backend rejected It,
    // not when the server is simply unreachable
    if(error.response?.status === 401){
        localStorage.removeItem("token")
    }
})  
.finally(()=>{
    if(!cancelled) setLoading(false)
}) 

return ()=>{cancelled =true}

},[])

// 2. if any later request return 401.(eg token expired after 1hr),logout

useEffect(()=>{

    const id=API.interceptors.response.use(
        (response)=> response,
        (error)=>{
            if(
                error.response?.status===401 &&
                localStorage.getItem("token")
            ){
                logout()
            }
            return Promise.reject(error)
        }
    )
    return ()=>API.interceptors.response.eject(id)
},[logout])

// called login page after /auth/login/succeeds
const login = useCallback(async(token)=>{
    localStorage.setItem("token",token)
    try {
        const {data}=await API.get("/auth/me")
        setUser(data.user)
    } catch (error) {
        localStorage.removeItem("token")
        throw error 
    }
},[])

const value=useMemo(
    ()=>({user,loading,isAuthenticated:Boolean(user),login,logout}),[user,loading,login,logout]
)

  return (
    <AuthContext.Provider value={value}>
        {Children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
