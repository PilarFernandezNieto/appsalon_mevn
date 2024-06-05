import api from "@/lib/axios";

export default {
  register(data) {
    api.post("/auth/register", data);
  }
};
