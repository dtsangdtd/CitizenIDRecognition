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
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"; // Changed to dayjs
import dayjs from "dayjs";
import { useEffect, useCallback } from "react";
import logo from "./assets/logo-pt.png";
// ... existing code ...

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


  const handlePaste = useCallback(
    (e) => {
      if (e.ctrlKey) {
        e.preventDefault();
        e.stopPropagation();
        navigator.clipboard
          .readText()
          .then((text) => {
            // Only process if text contains '|' character
            if (text.includes("|")) {
              const [
                cccd,
                cmnd,
                fullName,
                dateOfBirth,
                gender,
                address,
                dateOfIssue,
              ] = text.split("|");

              setValue("cccd", cccd || "");
              setValue("cmnd", cmnd || "");
              setValue("fullName", fullName || "");
              setValue(
                "dateOfBirth",
                dateOfBirth ? normalizeDate(dateOfBirth) : null
              );
              setValue(
                "gender",
                gender === "Nam" ? "male" : gender === "Nữ" ? "female" : "other"
              );
              setValue("address", address || "");
              setValue(
                "dateOfIssue",
                dateOfIssue ? normalizeDate(dateOfIssue) : null
              );
            }
          })
          .catch((err) => console.error("Failed to read clipboard:", err));
      }
    },
    [setValue]
  );

  useEffect(() => {
    const handleGlobalPaste = (e) => {
      if (e.ctrlKey && e.code === "KeyV") {
        handlePaste(e);
      }
    };

    window.addEventListener("keydown", handleGlobalPaste);
    return () => window.removeEventListener("keydown", handleGlobalPaste);
  }, [handlePaste]);

  const onSubmit = (data) => {
    console.log(data);
    // Handle form submission here
  };

  const normalizeDate = (dateStr) => {
    // Convert date from DDMMYYYY to Date object
    const day = dateStr.substring(0, 2);
    const month = dateStr.substring(2, 4);
    const year = dateStr.substring(4, 8);
    return dayjs(`${year}-${month}-${day}`);
  };

  return (
    <Container maxWidth>
      <Box sx={{ px: 40 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src={logo}
            alt=""
            style={{ width: 100, height: 100, padding: 10 }}
          />
        </Box>
        <Typography variant="h4" fontWeight="bold" align="center" gutterBottom>
          ĐỌC QR CĂN CƯỚC
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            {/* ... existing RadioGroup for idType ... */}

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Căn cước công dân 12 số"
                {...register("cccd")}
                onKeyDown={handlePaste}
                InputLabelProps={{ shrink: true }} // Add this line
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Chứng minh nhân dân 9 số"
                {...register("cmnd")}
                InputLabelProps={{ shrink: true }} // Add this line
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Họ và tên"
                {...register("fullName")}
                InputLabelProps={{ shrink: true }} // Add this line
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Ngày sinh"
                  onChange={(date) => setValue("dateOfBirth", date)}
                  value={watch("dateOfBirth")}
                  format="DD/MM/YYYY"
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} sm={6}>
              <RadioGroup row value={watch("gender")} {...register("gender")}>
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
                label="Address"
                {...register("address")}
                InputLabelProps={{ shrink: true }} // Add this line
              />
            </Grid>

            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Ngày cấp"
                  onChange={(date) => setValue("dateOfIssue", date)}
                  value={watch("dateOfIssue")}
                  format="DD/MM/YYYY"
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
            </Grid>

            {/* ... existing submit button ... */}
          </Grid>
        </form>
      </Box>
    </Container>
  );
}

export default App;
