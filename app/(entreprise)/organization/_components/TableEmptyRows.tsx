import PropTypes from "prop-types";
import { TableRow, TableCell } from "@mui/material";

// Define the props interface
interface TableEmptyRowsProps {
  emptyRows?: number; // Optional because it defaults to undefined
  height?: number; // Optional because it defaults to undefined
}

export default function TableEmptyRows({
  emptyRows,
  height,
}: TableEmptyRowsProps) {
  if (!emptyRows) {
    return null;
  }

  return (
    <TableRow
      sx={{
        ...(height && {
          height: height * emptyRows,
        }),
      }}
    >
      <TableCell colSpan={9} />
    </TableRow>
  );
}

// Define prop types using PropTypes for runtime validation
TableEmptyRows.propTypes = {
  emptyRows: PropTypes.number,
  height: PropTypes.number,
};
