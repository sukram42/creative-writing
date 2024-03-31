import { Navigate, useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import { useEffect, useState } from "react";

export default function RequireAuth({ children }) {
  const [stateUser, setUser] = useState()
  const [loading, setLoading] = useState<boolean>(false)
  const navigate = useNavigate();

  async function getUser() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()

    console.log("user", user)

    setUser(user)
    setLoading(false)
    if (!user){
      navigate("/login")
    }
  }
  useEffect(() => {
    if (!loading && !stateUser) getUser()
  }, [])

  return <>
    {(!loading && stateUser) ? children : "not logined"}
  </>
}