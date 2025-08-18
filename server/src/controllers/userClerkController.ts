import type { Request, Response } from "express";
import { clerkClient } from "../index.js" 

export const updateUser = async (req: Request, res: Response): Promise<void> => {
    // getting userId from req
    const { userId } = req.params;
    // get userData from body
    const userData = req.body;
  

    if (!userId) {
      res.status(400).json({ message: "User ID is required" });
      return;
    }
  
    try {
      // use clerk client to update user metadata. For the user data, we pass in publicMetadata with two members
      // userType obtained from userData's userType, and settings, from userData's setting member

      const user = await clerkClient.users.updateUserMetadata(userId, {
        publicMetadata: {
            userType: userData.publicMetadata.userType,
            settings: userData.publicMetadata.settings,
        },
      });
      res.json({ message: "User updated successfully", data: user});
    } catch (error: any) {
      res.status(500).json({ message: "Error updating user", error });
    }
  };
  