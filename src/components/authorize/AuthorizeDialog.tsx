"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addAuthorizeUser } from "@/lib/api/users";

interface AddUserDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (email: string) => void;
}

const AddUserDialog = ({ open, onClose, onSubmit }: AddUserDialogProps) => {
  const queryClient = useQueryClient();

  const createUser = useMutation({
    mutationFn: (create: { email: string }) => addAuthorizeUser(create),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authorizeUsers"] });
    },
  });
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    if (!email) return;
    onSubmit(email);
    createUser.mutate({ email });
    setEmail("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth sx={{ borderRadius: 2 }}>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" sx={{ color: "black", fontWeight: 600 }}>
            Add New Authorized User
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="email"
          label="Email Address"
          type="email"
          fullWidth
          variant="standard"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{ color: "black", borderRadius: 2 }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{ color: "white", backgroundColor: "black", borderRadius: 2 }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddUserDialog;
