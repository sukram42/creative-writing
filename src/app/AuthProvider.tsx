import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import { ReactNode, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

export default function RequireAuth({ children }: {children: ReactNode}) {
  const [stateUser, setUser] = useState<User | null>()
  const [loading, setLoading] = useState<boolean>(false)
  const navigate = useNavigate();

  async function getUser() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()


    setUser(user)
    setLoading(false)
    if (!user){
      navigate("/login")
    }
  }
  useEffect(() => {
    if (!loading && !stateUser) getUser()
  }, [getUser, loading, stateUser])

  return <>
    {(!loading && stateUser) ? children : "not logined"}
  </>
}