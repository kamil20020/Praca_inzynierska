import { Box, Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React from "react";
import { ManageUserChildProps } from "../ManageUser";

export interface TechnologyInfo {
    name: string,
    category: string,
    supplier: string
};

const data: TechnologyInfo[] = [
    {
        name: 'Java',
        category: 'Język programowania',
        supplier: 'Oracle'
    },
    {
        name: 'React',
        category: 'Framework',
        supplier: 'Facebook'
    },
    {
        name: 'React1',
        category: 'Framework',
        supplier: 'Facebook'
    },
    {
        name: 'React2',
        category: 'Framework',
        supplier: 'Facebook'
    },
    {
        name: 'React3',
        category: 'Framework',
        supplier: 'Facebook'
    },
    {
        name: 'React4',
        category: 'Framework',
        supplier: 'Facebook'
    },
    {
        name: 'React5',
        category: 'Framework',
        supplier: 'Facebook'
    },
]

const ReviewerTechnologies = (props: ManageUserChildProps) => {

    const userAccountId: string = props.userAccountId

    const [name, setName] = React.useState('');

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
  
    const handleChangePage = (event: unknown, newPage: number) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };

    return (
        <React.Fragment>
             <Grid item xs={5.5} container alignItems="stretch" justifyContent="center" direction="column">
                <Grid item xs={12}>
                    <Typography textAlign="center" variant="h5" sx={{marginBottom: 5}}>
                        Znane przez użytkownika technologie
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Paper>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="right">
                                            <Button
                                                variant="contained"
                                                color="secondary"
                                            >
                                                Dodaj
                                            </Button>
                                        </TableCell>
                                        <TableCell align="right"></TableCell>
                                        <TableCell align="right">Wyszukaj</TableCell>
                                        <TableCell align="left">
                                            <TextField
                                                id="search"
                                                placeholder="Nazwa technologii"
                                                color="secondary"
                                                value={name}
                                                onChange={(event: any) => setName(event.target.value)} 
                                            />
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                {data
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row: TechnologyInfo, index: number) => (
                                        <TableRow
                                            key={row.name}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell align="center">{row.name}</TableCell>
                                            <TableCell align="center">{row.category}</TableCell>
                                            <TableCell align="center">{row.supplier}</TableCell>
                                            <TableCell align="center">
                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                >
                                                    Usuń
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[5, 25, 100]}
                            component="div"
                            count={data.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Paper>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}

export default ReviewerTechnologies;