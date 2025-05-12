"use client";

import { useState } from "react";
import axios from "axios";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
  Button,
  Paper,
  Skeleton,
  Alert,
  Divider,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";

type SummaryData = {
  total: number;
  assigned: number;
  available: number;
};

type TableData = Record<string, number>;

type DashboardResponse = {
  summary: SummaryData;
  data: {
    all: TableData;
    assigned: TableData;
    available: TableData;
  };
};

const fetchDashboardData = async (): Promise<DashboardResponse> => {
  const response = await axios.get<DashboardResponse>("/api/dashboard");
  return response.data;
};

const Dashboard = () => {
  const [filter, setFilter] = useState<"all" | "assigned" | "available">("all");

  const { data, isLoading, isError, error, refetch } = useQuery<
    DashboardResponse,
    Error
  >({
    queryKey: ["dashboard"],
    queryFn: fetchDashboardData,
  });

  const handleFilterChange = (newFilter: "all" | "assigned" | "available") => {
    setFilter(newFilter);
  };

  const handleRetry = () => {
    refetch();
  };

  return (
    <Box p={2} component={Paper} elevation={0} width={"100%"} display={"flex"} flexDirection={"column"} gap={2}>
      <Box display="flex" alignItems="center" pt={2} gap={1}>
        <KeyboardArrowRightIcon sx={{ color: "grey" }} />
        <Typography
          variant="body1"
          color="grey"
          component="a"
          href="/dashboard"
        >
          Dashboard
        </Typography>
      </Box>

      <Divider />

      <Box display="flex" gap={3}>
        {["all", "assigned", "available"].map((filterType) => (
          <Card
            key={filterType}
            onClick={() =>
              handleFilterChange(filterType as "all" | "assigned" | "available")
            }
            sx={{
              flex: "1 1 250px",
              cursor: "pointer",
              bgcolor: filter === filterType ? "#e3f2fd" : "background.paper",
              transition: "background-color 0.3s ease",
              "&:hover": {
                bgcolor: filter === filterType ? "#e3f2fd" : "#f5f5f5",
              },
            }}
          >
            <CardContent>
              <Typography variant="h6">
                {filterType === "all" && "Total Assets"}
                {filterType === "assigned" && "Assigned Assets"}
                {filterType === "available" && "Available Assets"}
              </Typography>
              {isLoading ? (
                <Skeleton variant="rectangular" width="60%" height={40} />
              ) : (
                <Typography variant="h4">
                  {filterType === "all" && (data?.summary.total ?? 0)}
                  {filterType === "assigned" && (data?.summary.assigned ?? 0)}
                  {filterType === "available" && (data?.summary.available ?? 0)}
                </Typography>
              )}
              <Typography color="text.secondary">
                {filterType === "all" && "All assets in the company"}
                {filterType === "assigned" && "Assigned to employees"}
                {filterType === "available" && "Ready to be assigned"}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Box>
        {isLoading ? (
          <Box display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        ) : isError ? (
          <Alert
            severity="error"
            action={
              <Button color="inherit" size="small" onClick={handleRetry}>
                Retry
              </Button>
            }
          >
            Failed to load data: {error?.message}
          </Alert>
        ) : (
          <Table sx={{ minWidth: 300 }}>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Asset Type</strong>
                </TableCell>
                <TableCell>
                  <strong>Asset Quantity</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(data?.data?.[filter] || {}).map(
                ([type, count]) => (
                  <TableRow key={type} hover>
                    <TableCell>{type}</TableCell>
                    <TableCell>{count}</TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        )}
      </Box>
    </Box>
  );
};

export default Dashboard;
