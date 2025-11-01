import { getAllLocationsFromAllUsers } from "../../app/lib/supabaseClient";
import { defineEventHandler } from "h3";

export default defineEventHandler(async () => {
    const users = await getAllLocationsFromAllUsers();
    return users ?? [];
});