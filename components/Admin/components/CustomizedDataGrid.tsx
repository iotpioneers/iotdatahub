import * as React from "react";
import { DataGrid, GridColDef, GridValidRowModel } from "@mui/x-data-grid";
import { columns, rows } from "../internals/data/gridData";

export default function CustomizedDataGrid() {
  return (
    <DataGrid
      columns={columns as GridColDef<GridValidRowModel>[]}
      rows={rows}
      initialState={{
        pagination: {
          paginationModel: { pageSize: 20 },
        },
      }}
      pageSizeOptions={[10, 20, 50]}
      disableColumnResize
      density="compact"
      slotProps={{
        filterPanel: {
          filterFormProps: {
            logicOperatorInputProps: {
              variant: "outlined",
              size: "small",
            },
            columnInputProps: {
              variant: "outlined",
              size: "small",
              sx: { mt: "auto" },
            },
            operatorInputProps: {
              variant: "outlined",
              size: "small",
              sx: { mt: "auto" },
            },
            valueInputProps: {
              InputComponentProps: {
                variant: "outlined",
                size: "small",
              },
            },
          },
        },
      }}
    />
  );
}
