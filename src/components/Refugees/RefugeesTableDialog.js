import { useState } from "react";
import {
    Button,
    Dialog,
    AppBar,
    Typography,
    IconButton,
    Toolbar,
    Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import useHttp from "../../hooks/useHttp";
import AppDataGrid from "../AppDataGrid";
import Search from "../Search";
import AddRefugeeDialog from "./AddRefugeeDialog";

const TITLE = "Біженці";

const COLUMNS = [
    { field: "id", hide: true },
    { field: "name", headerName: "ПІБ", width: 350 },
    { field: "from", headerName: "Звідки", width: 250 },
    { field: "passportId", headerName: "Паспорт ID", width: 150 },
    { field: "phoneNumber", headerName: "Номер телефону", width: 150 },
    {
        field: "car",
        headerName: "Автомобіль",
        width: 300,
        valueFormatter: ({ value }) =>
            value ? `${value.model}${value.number}` : "",
    },
    { field: "stayAddress", headerName: "Адреса перебування", width: 350 },
    { field: "stayNumber", headerName: "Номер хоста", width: 150 },
];

const RefugeesTableDialog = () => {
    const [open, setOpen] = useState(false);
    const [fetchedRefugees, setFetchedRefugees] = useState([]);
    const [search, setSearch] = useState("");

    const { request, loading } = useHttp();

    const handleClickOpen = () => {
        getRefugees();
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const getRefugees = async () => {
        try {
            const res = await request("/refugee", "GET");
            setFetchedRefugees(res.refugees);
        } catch (e) {
            console.log(e);
        }
    };

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
    };

    const handleAddRefugeeSubmit = (refugee) => {
        setFetchedRefugees([refugee, ...fetchedRefugees]);
    };

    const handleDeleteRefugee = async (_id) => {
        try {
            await request("/refugee/delete", "DELETE", { _id });
            const index = fetchedRefugees.findIndex(fr => fr._id === _id);
            const updFetchedRefugees = [...fetchedRefugees];
            updFetchedRefugees.splice(index, 1);
            setFetchedRefugees(updFetchedRefugees);
        } catch(e) {
            console.log(e);
        }
    };

    const refugees = search
        ? fetchedRefugees.filter(
              (fr) =>
                  Object.values(fr)
                      .join(", ")
                      .toLowerCase()
                      .indexOf(search.toLowerCase()) !== -1
          )
        : fetchedRefugees;

    const actionsColumn = {
        field: "actions",
        headerName: "Дії",
        
        type: "number",
        width: 90,
        renderCell: (params) => {
            return (
                <Grid container justifyContent="center">
                    <IconButton
                        edge="start"
                        color="inherit"
                        disabled={loading}
                        onClick={() => handleDeleteRefugee(params.id)}
                    >
                        <DeleteIcon />
                    </IconButton>
                </Grid>
            );
        },
    };

    const columns = [actionsColumn, ...COLUMNS];

    return (
        <div>
            <Button variant="contained" size="large" onClick={handleClickOpen}>
                {TITLE}
            </Button>
            <Dialog fullScreen open={open} onClose={handleClose}>
                <AppBar sx={{ position: "relative" }}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleClose}
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography
                            sx={{ ml: 2, flex: 1, mr: 2 }}
                            variant="h6"
                            component="div"
                        >
                            {TITLE}
                        </Typography>
                        <Search value={search} onChange={handleSearchChange} />
                        <AddRefugeeDialog onSubmit={handleAddRefugeeSubmit} />
                    </Toolbar>
                </AppBar>
                {refugees.length ? (
                    <AppDataGrid columns={columns} rows={refugees} />
                ) : loading ? (
                    <Typography variant="h6" mt={2} ml={3}>
                        Завантаження...
                    </Typography>
                ) : (
                    <Typography variant="h6" mt={2} ml={3}>
                        Нема результатів
                    </Typography>
                )}
            </Dialog>
        </div>
    );
};

export default RefugeesTableDialog;
