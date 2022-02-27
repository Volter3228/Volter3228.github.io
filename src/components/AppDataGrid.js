import { DataGrid } from "@mui/x-data-grid";

const AppDataGrid = ({ rows, columns }) => {
    return (
        <div className="my-data-grid w-100">
            <DataGrid
                rows={rows}
                columns={columns}
                headerHeight={70}
                rowHeight={60}
                disableSelectionOnClick
                disableColumnMenu
                autoHeight
                density="compact"
                getRowId={(row) => row._id}
            />
        </div>
    );
};

export default AppDataGrid;
