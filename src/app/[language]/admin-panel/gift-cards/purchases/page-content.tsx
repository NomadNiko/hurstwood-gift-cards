"use client";

import { RoleEnum } from "@/services/api/types/role";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import { useGetGiftCardsQuery } from "./queries/queries";
import removeDuplicatesFromArrayObjects from "@/services/helpers/remove-duplicates-from-array-of-objects";
import { useMemo } from "react";

const statusColors: Record<
  string,
  "success" | "warning" | "error" | "default"
> = {
  active: "success",
  partially_redeemed: "warning",
  fully_redeemed: "default",
  cancelled: "error",
};

function PurchasesList() {
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage, isLoading } =
    useGetGiftCardsQuery();

  const giftCards = useMemo(() => {
    const result = data?.pages.flatMap((page) => page?.data || []) ?? [];
    return removeDuplicatesFromArrayObjects(result, "id");
  }, [data]);

  return (
    <Container maxWidth="lg">
      <Grid container spacing={3} pt={3}>
        <Grid size={12}>
          <Typography variant="h4">Gift Card Purchases</Typography>
        </Grid>

        {isLoading && (
          <Grid size={12}>
            <LinearProgress />
          </Grid>
        )}

        <Grid size={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Code</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Balance</TableCell>
                  <TableCell>Purchaser</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {giftCards.map((gc) => (
                  <TableRow key={gc.id}>
                    <TableCell
                      sx={{ fontFamily: "monospace", fontWeight: 600 }}
                    >
                      {gc.code}
                    </TableCell>
                    <TableCell>${gc.originalAmount.toFixed(2)}</TableCell>
                    <TableCell>${gc.currentBalance.toFixed(2)}</TableCell>
                    <TableCell>
                      {gc.purchaserName}
                      <br />
                      <Typography variant="caption" color="text.secondary">
                        {gc.purchaserEmail}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {new Date(gc.purchaseDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={gc.status.replace("_", " ")}
                        color={statusColors[gc.status] || "default"}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
                {!isLoading && giftCards.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography color="text.secondary" py={3}>
                        No purchases yet.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        {hasNextPage && (
          <Grid size={12} sx={{ textAlign: "center" }}>
            <Button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
            >
              {isFetchingNextPage ? "Loading..." : "Load More"}
            </Button>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}

export default withPageRequiredAuth(PurchasesList, {
  roles: [RoleEnum.ADMIN],
});
