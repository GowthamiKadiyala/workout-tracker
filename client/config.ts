import { Platform } from "react-native";

// 1. Local Development URL (Your computer)
const LOCAL_URL = "http://localhost:3000";

// 2. Production URL (When you deploy to cloud later)
// const PROD_URL = 'https://my-workout-app.onrender.com';

// Logic: Pick the right one automatically
const API_URL = LOCAL_URL;

export default API_URL;
