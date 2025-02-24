import { useForm } from "react-hook-form";
import {
  TextField,
  RadioGroup,
  Radio,
  FormControlLabel,
  Container,
  Grid,
  Typography,
  Box,
  Stack,
  CircularProgress,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useEffect, useState, useCallback } from "react";
import logo from "./assets/logo-pt.png";

function App() {
  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      cccd: "",
      cmnd: "",
      fullName: "",
      dateOfBirth: null,
      gender: "",
      address: "",
      dateOfIssue: null,
    },
  });

  const [scanBuffer, setScanBuffer] = useState("");
  const [isScanning, setIsScanning] = useState(false);

  const processScannedData = useCallback(
    (scannedText) => {
      const normalizeDate = (dateStr) => {
        if (!dateStr || dateStr.length !== 8) return null;
        const day = dateStr.substring(0, 2);
        const month = dateStr.substring(2, 4);
        const year = dateStr.substring(4, 8);
        return dayjs(`${year}-${month}-${day}`);
      };

      if (scannedText.includes("|")) {
        const parts = scannedText.split("|");
        if (parts.length === 7) {
          const [
            cccd,
            cmnd,
            fullName,
            dateOfBirth,
            gender,
            address,
            dateOfIssue,
          ] = parts;

          setValue("cccd", cccd.trim());
          setValue("cmnd", cmnd.trim());
          setValue("fullName", fullName.trim());
          setValue("dateOfBirth", normalizeDate(dateOfBirth));
          setValue("gender", gender.trim() === "Nam" ? "male" : "female");
          setValue("address", address.trim());
          setValue("dateOfIssue", normalizeDate(dateOfIssue));
        }
      }
    },
    [setValue]
  );

  useEffect(() => {
    let scanTimeout;

    const handleKeyDown = (e) => {
      // Ignore tab, shift, control, alt, arrow keys, and other non-character keys
      if (
        e.key === "Tab" ||
        e.key === "Shift" ||
        e.key === "Control" ||
        e.key === "Alt" ||
        e.key.startsWith("Arrow") || // Arrow keys
        e.key === "CapsLock" ||
        e.key === "Escape"
      ) {
        return;
      }

      // Prevent handling input inside text fields
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") {
        return;
      }

      if (!isScanning) {
        setIsScanning(true); // Start scanning when first valid key is detected
      }

      if (e.key.length === 1) {
        setScanBuffer((prev) => prev + e.key);
      }

      if (e.key === "Enter") {
        processScannedData(scanBuffer.trim());
        setScanBuffer(""); // Clear buffer
        setIsScanning(false);
        e.preventDefault(); // Prevent default enter behavior
      }

      // Reset scanning state after 1 second if no further input
      clearTimeout(scanTimeout);
      scanTimeout = setTimeout(() => {
        setIsScanning(false);
      }, 1000);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(scanTimeout);
    };
  }, [scanBuffer, processScannedData, isScanning]);

  return (
    <Container maxWidth="md" position="relative">
      <Box px={5}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src={logo}
            alt="Logo"
            style={{ width: 100, height: 100, padding: 10 }}
          />
        </Box>
        <Typography variant="h4" fontWeight="bold" align="center" gutterBottom>
          ĐỌC QR CĂN CƯỚC
        </Typography>
        <Box
          sx={{
            margin: "0 auto",
            width: "100%",
          }}
        >
          <form
            onSubmit={handleSubmit((data) =>
              console.log("Form Submitted:", data)
            )}
          >
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Căn cước công dân 12 số"
                  {...register("cccd")}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Chứng minh nhân dân 9 số"
                  {...register("cmnd")}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Họ và tên"
                  {...register("fullName")}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Ngày sinh"
                    value={watch("dateOfBirth")}
                    onChange={(date) => setValue("dateOfBirth", date)}
                    format="DD/MM/YYYY"
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <RadioGroup
                  row
                  value={watch("gender")}
                  onChange={(e) => setValue("gender", e.target.value)}
                >
                  <FormControlLabel
                    value="male"
                    control={<Radio />}
                    label="Nam"
                  />
                  <FormControlLabel
                    value="female"
                    control={<Radio />}
                    label="Nữ"
                  />
                </RadioGroup>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Địa chỉ"
                  {...register("address")}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Ngày cấp"
                    value={watch("dateOfIssue")}
                    onChange={(date) => setValue("dateOfIssue", date)}
                    format="DD/MM/YYYY"
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Box>
      {isScanning && (
        <Stack
          position={"absolute"}
          top={0}
          left={0}
          transform={"translate(50%, 50%)"}
          spacing={2}
          bgcolor={"rgba(0, 0, 0, 0.7)"}
          direction="row"
          width={"100%"}
          height={"100%"}
          alignItems="center"
          display="flex"
          justifyContent="center"
          zIndex={999}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
            }}
          >
            <CircularProgress
              size={60}
              sx={{
                position: "absolute",
              }}
            />
          </Box>
        </Stack>
      )}
    </Container>
  );
}

export default App;
