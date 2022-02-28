import { useState, useRef } from "react";
import {
    IconButton,
    DialogTitle,
    Dialog,
    DialogContent,
    Typography,
    TextField as MuiTextField,
    DialogActions,
    Button,
    Box,
    Divider,
    Grid,
} from "@mui/material";
import AddCircle from "@mui/icons-material/AddCircle";
import useHttp from "../../hooks/useHttp";

const TextField = (props) => (
    <MuiTextField
        fullWidth
        variant="outlined"
        margin="dense"
        type="text"
        size="small"
        inputProps={{
            autoComplete: 'off'
        }}
        {...props}
    />
);

const initialForm = {
    name: "",
    from: "",
    passportId: "",
    phoneNumber: "",
    stayAddress: '',
    stayNumber: '',
    car: {
        model: "",
        number: "",
    },
};

const AddRefugeeDialog = ({ onSubmit }) => {
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState(initialForm);
    const { request, loading } = useHttp();
    const formRef = useRef();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = async () => {
        const result = formRef.current.reportValidity();
        if (result) {
            try {
                const res = await request("/refugee/create", "POST", form);
                onSubmit(res.refugee);
                setForm(initialForm);
                handleClose();
            } catch(e) {
                console.log(e);
            }
        }

    };

    const handleFormChange = (event) => {
        const { value, name } = event.target;
        if (!Object.keys(form.car).includes(name)) {
            setForm({ ...form, [name]: value });
        } else {
            setForm({ ...form, car: { ...form.car, [name]: value } });
        }
    };

    return (
        <div>
            <IconButton
                size="large"
                color="inherit"
                sx={{ marginLeft: "1rem" }}
                onClick={handleClickOpen}
            >
                <AddCircle />
            </IconButton>
            <Dialog onClose={handleClose} open={open} fullWidth>
                <Box component="form" ref={formRef}>
                    <DialogTitle onClose={handleClose}>
                        Додати біженця
                    </DialogTitle>
                    <DialogContent dividers>
                        <TextField
                            autoFocus
                            required
                            label="ПІБ"
                            name="name"
                            value={form.name}
                            onChange={handleFormChange}
                        />
                        <TextField
                            required
                            label="Звідки"
                            name="from"
                            value={form.from}
                            onChange={handleFormChange}
                        />
                        <TextField
                            required
                            label="Паспорт ID"
                            name="passportId"
                            value={form.passportId}
                            onChange={handleFormChange}
                        />
                        <TextField
                            required
                            label="Номер телефону"
                            name="phoneNumber"
                            value={form.phoneNumber}
                            onChange={handleFormChange}
                            sx={{ paddingBottom: "0.7rem" }}
                        />
                        <Divider />
                        <Typography
                            variant="subtitle2"
                            sx={{ paddingTop: "0.7rem" }}
                        >
                            Автомобіль
                        </Typography>
                        <Grid container spacing={1}>
                            <Grid item xs={6}>
                                <TextField
                                    label="Модель"
                                    name="model"
                                    value={form.car.model}
                                    onChange={handleFormChange}
                                    sx={{ paddingBottom: "1rem" }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="Номер"
                                    name="number"
                                    value={form.car.number}
                                    onChange={handleFormChange}
                                    sx={{ paddingBottom: "1rem" }}
                                />
                            </Grid>
                        </Grid>
                        <Divider />
                        <Typography
                            variant="subtitle2"
                            sx={{ paddingTop: "0.7rem" }}
                        >
                            Хост
                        </Typography>
                        <Grid container spacing={1}>
                            <Grid item xs={6}>
                                <TextField
                                    required
                                    label="Адреса"
                                    name="stayAddress"
                                    value={form.stayAddress}
                                    onChange={handleFormChange}
                                    sx={{ paddingBottom: "1rem" }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    required
                                    label="Номер телефону"
                                    name="stayNumber"
                                    value={form.stayNumber}
                                    onChange={handleFormChange}
                                    sx={{ paddingBottom: "1rem" }}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} disabled={loading}>Відміна</Button>
                        <Button variant="contained" onClick={handleSubmit} disabled={loading}>
                            Додати
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </div>
    );
};

export default AddRefugeeDialog;
