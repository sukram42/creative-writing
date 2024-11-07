import { createClient } from "@supabase/supabase-js"
import { Database } from "./supabase"

// // const supabaseUrl = 'https://lsxgepyhuhidvpsdsnli.supabase.co'
// const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzeGdlcHlodWhpZHZwc2RzbmxpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTE5MTA3NDIsImV4cCI6MjAyNzQ4Njc0Mn0.GQkXKqCACbYgDx8WKch_qUg9NYgEdjmoVxiL_DaEO0A"
// const supabaseUrl = "http://127.0.0.1:54321"
// const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0"

const supabaseUrl = import.meta.env.VITE_REACT_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_REACT_SUPABASE_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)
// Types
export type Chapter = Database["public"]["Tables"]["chapters"]["Row"]
export type Project = Database["public"]["Tables"]["projects"]["Row"]
export type Item = Database["public"]["Tables"]["items"]["Row"]
export type ItemV2 = Database["public"]["Tables"]["items_v2"]["Row"]
export type ItemVersion = Database["public"]["Tables"]["items_v2_audit"]["Row"]
export type ItemType = Database["public"]["Enums"]["ItemType"]
export type Profile = Database["public"]["Tables"]["profiles"]["Row"]
