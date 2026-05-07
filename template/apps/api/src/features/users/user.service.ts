import { userRepo } from "./user.repository.js";
import { AppError } from "../../utils/errors/AppError.js";
export const userService = {
  list: (q: { page?: number; limit?: number; role?: string }) => userRepo.list(q),
  async getById(id: string) {
    const u = await userRepo.findById(id);
    if (!u) throw AppError.notFound("User not found");
    return u;
  },
  updateProfile: (id: string, p: { name?: string; avatar_url?: string }) => userRepo.update(id, p),
  async updateRole(id: string, role: string) {
    if (!["admin", "user", "moderator"].includes(role)) throw AppError.badRequest("Invalid user role");
    return userRepo.update(id, { role });
  },
  delete: (id: string) => userRepo.delete(id),
};
