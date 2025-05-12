"use client";

import React, { useState, useMemo } from "react";
import { deleteAuthorizeUser, getAuthorizeUsers } from "@/lib/api/users";
import { AuthorizeUser } from "@/lib/types/Employees";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
  Typography,
  IconButton,
  Button,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function AuthorizeUserTable() {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const {
    data: users,
    isLoading,
    isError,
    error,
  } = useQuery<AuthorizeUser[], Error>({
    queryKey: ["authorizeUsers"],
    queryFn: getAuthorizeUsers,
  });

  const deleteUser = useMutation({
    mutationFn: (user: { id: string }) => deleteAuthorizeUser(user.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authorizeUsers"] });
    },
  });

  const totalPages = useMemo(() => {
    return users ? Math.ceil(users.length / usersPerPage) : 0;
  }, [users]);

  const currentUsers = useMemo(() => {
    if (!users) return [];
    const start = (currentPage - 1) * usersPerPage;
    return users.slice(start, start + usersPerPage);
  }, [users, currentPage]);

  return (
    <>
      <Box width="100%" border={1} borderRadius={2} borderColor="grey.300">
        {isLoading ? (
          <CircularProgress />
        ) : isError ? (
          <Typography color="error">{error.message}</Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="body1" color="grey">
                    Email
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" color="grey">
                    Action
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <IconButton
                      sx={{
                        border: 1,
                        borderRadius: 2,
                        width: "20%",
                        borderColor: "grey.300",
                      }}
                      onClick={() => {
                        deleteUser.mutate({ id: user.id });
                      }}
                    >
                      <DeleteOutlineIcon color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Box>
      <Typography variant="body1" mt={1}>
        Total Users: {users?.length}
      </Typography>

      <Box width="100%" display="flex" justifyContent="center" gap={2} pt={2}>
        <Button
          variant="contained"
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
        >
          Prev
        </Button>
        <Button
          variant="contained"
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </Box>
    </>
  );
}

export default AuthorizeUserTable;
