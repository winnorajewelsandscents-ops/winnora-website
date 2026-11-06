import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const supabaseUrl = "https://mvqehokzdxnffzhztiir.supabase.co";
const supabaseKey = "sb_publishable__fbfvfT-cAenAq8SQaqZYA_xP9QT-E0";

export const supabase = createClient(
    supabaseUrl,
    supabaseKey,
    {
        db: {
            schema: "public"
        }
    }
);