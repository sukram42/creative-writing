import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import { ReactNode, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { useDispatch } from "react-redux";
import { setUser } from "./ui.slice/ui.slice";

export default function RequireAuth({ children }: { children: ReactNode }) {
  const [stateUser, setStateUser] = useState<User | null>()
  const [loading, setLoading] = useState<boolean>(false)
  const navigate = useNavigate();
  const dispatch = useDispatch()

  async function getUser() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    const { data: profile } = await supabase.from("profiles").select("*").select()

    dispatch(setUser(user || undefined))

    setStateUser(user)
    setLoading(false)
    if (!user || profile === null) {
      navigate("/login")
      return
    }
    if (!profile[0].is_onboarded || !profile[0].password_set) {
      navigate("/onboarding")
    }
  }


  useEffect(() => {
    if (!loading && !stateUser) getUser()
  }, [getUser, loading, stateUser])

  return <>
    {(!loading && stateUser) ? children : "not logined"}
  </>
}