import axios from "axios";

const APP_URL = import.meta.env.VITE_API_APP_URL;

export const checkAppIsRunning = async () => {
  try {
    const response = await axios.get(`${APP_URL}/ping`);
    return response.status === 200;
  } catch {
    return false;
  }
};
