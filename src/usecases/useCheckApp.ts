import axios from "axios";

export const checkAppIsRunning = async () => {
  try {
    const response = await axios.get("http://localhost:3010/ping");
    return response.status === 200;
  } catch {
    return false;
  }
};
