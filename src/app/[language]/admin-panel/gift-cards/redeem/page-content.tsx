"use client";

import { RoleEnum } from "@/services/api/types/role";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Alert from "@mui/material/Alert";
import Divider from "@mui/material/Divider";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Box from "@mui/material/Box";
import { useState, useCallback } from "react";
import {
  useGetGiftCardByCodeService,
  useRedeemGiftCardService,
} from "@/services/api/services/gift-cards";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { GiftCard } from "@/services/api/types/gift-card";

function RedeemPage() {
  const [code, setCode] = useState("");
  const [giftCard, setGiftCard] = useState<GiftCard | null>(null);
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const lookupService = useGetGiftCardByCodeService();
  const redeemService = useRedeemGiftCardService();

  const handleLookup = useCallback(async () => {
    setError(null);
    setSuccess(null);
    setGiftCard(null);
    if (!code.trim()) return;
    setLoading(true);
    try {
      const { status, data } = await lookupService(code.trim().toUpperCase());
      if (status === HTTP_CODES_ENUM.OK && data) {
        setGiftCard(data);
      } else {
        setError("Gift card not found.");
      }
    } catch {
      setError("Gift card not found.");
    } finally {
      setLoading(false);
    }
  }, [code, lookupService]);

  const handleRedeem = useCallback(async () => {
    if (!giftCard) return;
    setError(null);
    setSuccess(null);
    const redeemAmount = parseFloat(amount);
    if (isNaN(redeemAmount) || redeemAmount <= 0) {
      setError("Enter a valid amount.");
      return;
    }
    if (redeemAmount > giftCard.currentBalance) {
      setError("Amount exceeds current balance.");
      return;
    }
    setLoading(true);
    try {
      const { status, data } = await redeemService(giftCard.id, {
        amount: redeemAmount,
        notes: notes || undefined,
      });
      if (status === HTTP_CODES_ENUM.OK) {
        setGiftCard(data);
        setAmount("");
        setNotes("");
        setSuccess(
          `Redeemed $${redeemAmount.toFixed(2)}. Remaining balance: $${data.currentBalance.toFixed(2)}`
        );
      }
    } catch {
      setError("Redemption failed.");
    } finally {
      setLoading(false);
    }
  }, [giftCard, amount, notes, redeemService]);

  return (
    <Container maxWidth="md">
      <Grid container spacing={3} pt={3}>
        <Grid size={12}>
          <Typography variant="h4">Redeem Gift Card</Typography>
        </Grid>

        {/* Lookup */}
        <Grid size={12}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="Gift Card Code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="GC-XXXX-XXXX-XXXX"
                fullWidth
                onKeyDown={(e) => e.key === "Enter" && handleLookup()}
                sx={{ "& input": { fontFamily: "monospace", fontSize: 18 } }}
              />
              <Button
                variant="contained"
                onClick={handleLookup}
                disabled={loading}
                sx={{ minWidth: 120 }}
              >
                Lookup
              </Button>
            </Box>
          </Paper>
        </Grid>

        {error && (
          <Grid size={12}>
            <Alert severity="error">{error}</Alert>
          </Grid>
        )}
        {success && (
          <Grid size={12}>
            <Alert severity="success">{success}</Alert>
          </Grid>
        )}

        {/* Gift Card Details */}
        {giftCard && (
          <>
            <Grid size={12}>
              <Paper sx={{ p: 3 }}>
                <Grid container spacing={2}>
                  <Grid size={6}>
                    <Typography variant="body2" color="text.secondary">
                      Code
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{ fontFamily: "monospace", fontWeight: 700 }}
                    >
                      {giftCard.code}
                    </Typography>
                  </Grid>
                  <Grid size={6} sx={{ textAlign: "right" }}>
                    <Chip
                      label={giftCard.status.replace("_", " ")}
                      color={
                        giftCard.status === "active"
                          ? "success"
                          : giftCard.status === "partially_redeemed"
                            ? "warning"
                            : "default"
                      }
                    />
                  </Grid>
                  <Grid size={4}>
                    <Typography variant="body2" color="text.secondary">
                      Original Amount
                    </Typography>
                    <Typography variant="h6">
                      ${giftCard.originalAmount.toFixed(2)}
                    </Typography>
                  </Grid>
                  <Grid size={4}>
                    <Typography variant="body2" color="text.secondary">
                      Current Balance
                    </Typography>
                    <Typography
                      variant="h6"
                      color={
                        giftCard.currentBalance > 0
                          ? "success.main"
                          : "text.secondary"
                      }
                    >
                      ${giftCard.currentBalance.toFixed(2)}
                    </Typography>
                  </Grid>
                  <Grid size={4}>
                    <Typography variant="body2" color="text.secondary">
                      Purchaser
                    </Typography>
                    <Typography>{giftCard.purchaserName}</Typography>
                  </Grid>
                </Grid>

                {giftCard.currentBalance > 0 &&
                  giftCard.status !== "cancelled" && (
                    <>
                      <Divider sx={{ my: 3 }} />
                      <Typography variant="h6" gutterBottom>
                        Redeem
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          gap: 2,
                          alignItems: "flex-start",
                        }}
                      >
                        <TextField
                          label="Amount"
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          inputProps={{
                            min: 0.01,
                            max: giftCard.currentBalance,
                            step: 0.01,
                          }}
                          sx={{ width: 160 }}
                        />
                        <TextField
                          label="Notes (optional)"
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          sx={{ flex: 1 }}
                        />
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleRedeem}
                          disabled={loading}
                          sx={{ minWidth: 120, height: 56 }}
                        >
                          Redeem
                        </Button>
                      </Box>
                    </>
                  )}
              </Paper>
            </Grid>

            {/* Redemption History */}
            {giftCard.redemptions.length > 0 && (
              <Grid size={12}>
                <Typography variant="h6" gutterBottom>
                  Redemption History
                </Typography>
                <Paper>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Remaining</TableCell>
                        <TableCell>Notes</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {giftCard.redemptions.map((r) => (
                        <TableRow key={r.id}>
                          <TableCell>
                            {new Date(r.redeemedAt).toLocaleString()}
                          </TableCell>
                          <TableCell>${r.amount.toFixed(2)}</TableCell>
                          <TableCell>
                            ${r.remainingBalance.toFixed(2)}
                          </TableCell>
                          <TableCell>{r.notes || "-"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Paper>
              </Grid>
            )}
          </>
        )}
      </Grid>
    </Container>
  );
}

export default withPageRequiredAuth(RedeemPage, { roles: [RoleEnum.ADMIN] });
