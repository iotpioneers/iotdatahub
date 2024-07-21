// Define a type for the comparator function
type Comparator<T> = (a: T, b: T) => number;

// Define a type for objects used in the comparator
interface ComparableObject {
  [key: string]: any; // You might want to refine this type based on the actual object structure
}

// Styles for visually hidden elements
export const visuallyHidden = {
  border: 0,
  margin: -1,
  padding: 0,
  width: "1px",
  height: "1px",
  overflow: "hidden",
  position: "absolute",
  whiteSpace: "nowrap",
  clip: "rect(0 0 0 0)",
};

// Function to calculate empty rows
export function emptyRows(
  page: number,
  rowsPerPage: number,
  arrayLength: number
): number {
  return page ? Math.max(0, (1 + page) * rowsPerPage - arrayLength) : 0;
}

// Function for descending comparison
function descendingComparator<T extends ComparableObject>(
  a: T,
  b: T,
  orderBy: keyof T // This ensures `orderBy` is a valid key of T
): number {
  if (a[orderBy] === null) {
    return 1;
  }
  if (b[orderBy] === null) {
    return -1;
  }
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

// Function to get a comparator based on order
export function getComparator<Key extends string | number>(
  order: "asc" | "desc",
  orderBy: Key
): Comparator<ComparableObject> {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Function to apply filtering and sorting
export function applyFilter<T extends ComparableObject>({
  inputData,
  comparator,
  filterName,
}: {
  inputData: T[];
  comparator: Comparator<T>;
  filterName?: string;
}): T[] {
  // Stabilize the array for sorting
  const stabilizedThis = inputData.map(
    (el, index) => [el, index] as [T, number]
  );

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  // Apply filter if filterName is provided
  if (filterName) {
    inputData = inputData.filter(
      (user) => user.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  return inputData;
}
